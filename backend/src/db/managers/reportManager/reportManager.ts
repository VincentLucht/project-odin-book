import { Prisma, PrismaClient, Report } from '@prisma/client/default';
import formatReports from '@/db/managers/reportManager/util/formatReports';

export interface FetchedReports extends Report {
  report_count: number;
  // COMMENT
  comment_content: string | null;
  parent_post_body: string | null;
  parent_post_id: string | null;
  parent_post_title: string | null;
  comment_total_vote_score: string | null;
  comment_upvote_count: number;
  comment_downvote_count: number;
  // POST
  post_title: string | null;
  post_body: string | null;
  post_total_vote_score: string | null;
  post_upvote_count: number;
  post_downvote_count: number;
  // USER
  username: string;
  profile_picture_url: string | null;
  // MODERATOR
  moderator_username: string;
  moderator_pfp: string | null;
}

export default class ReportManager {
  constructor(private prisma: PrismaClient) {}

  async getBy(
    community_id: string,
    type: 'all' | 'posts' | 'comments',
    sortByType: 'new' | 'top',
    status: 'pending' | 'moderated' | 'approved' | 'dismissed',
    cursor?: { lastScore: number; lastDate: string; lastId: string },
    take = 30,
  ) {
    let orderByClause = Prisma.sql``;
    let cursorQuery = Prisma.sql``;
    let typeFilter = Prisma.sql``;
    let andClause = Prisma.sql``;

    const reportCountExpr = Prisma.sql`COALESCE(c.times_reported, p.times_reported, 0)`;

    // Order and Cursor filtering
    if (sortByType === 'top') {
      orderByClause = Prisma.sql`ORDER BY ${reportCountExpr} DESC, r.id ASC`;

      if (cursor?.lastScore && cursor?.lastId) {
        cursorQuery = Prisma.sql`
        AND ((${reportCountExpr} < ${cursor.lastScore})
        OR (${reportCountExpr} = ${cursor.lastScore}
        AND r.id > ${cursor.lastId}))`;
      }
    } else if (sortByType === 'new') {
      if (status !== 'pending') {
        orderByClause = Prisma.sql`ORDER BY r.moderated_at DESC, r.id ASC`;
      } else {
        orderByClause = Prisma.sql`ORDER BY r.created_at DESC, r.id ASC`;
      }

      if (cursor?.lastDate && cursor?.lastId) {
        cursorQuery = Prisma.sql`
        AND (r.created_at < ${cursor.lastDate}::timestamp
        OR (r.created_at = ${cursor.lastDate}::timestamp
        AND r.id > ${cursor.lastId}))`;
      }
    }

    // Type filtering
    if (type === 'posts') {
      typeFilter = Prisma.sql`AND r.post_id IS NOT NULL AND r.comment_id IS NULL`;
    } else if (type === 'comments') {
      typeFilter = Prisma.sql`AND r.comment_id IS NOT NULL AND r.post_id IS NULL`;
    }

    if (status === 'pending') {
      andClause = Prisma.sql`AND r.status='PENDING'`;
    } else if (status === 'moderated') {
      andClause = Prisma.sql`AND r.status IN ('REVIEWED', 'DISMISSED')`;
    } else if (status === 'approved') {
      andClause = Prisma.sql`AND r.status='REVIEWED'`;
    } else if (status === 'dismissed') {
      andClause = Prisma.sql`AND r.status='DISMISSED'`;
    }

    const reports = await this.prisma.$queryRaw<FetchedReports[]>`
      SELECT 
        r.*,
        u.profile_picture_url,
        u.username,

        p.title AS post_title,
        p.body AS post_body,
        p.total_vote_score AS post_total_vote_score,
        p.upvote_count AS post_upvote_count,
        p.downvote_count AS post_downvote_count,

        c.content AS comment_content,
        c.total_vote_score AS comment_total_vote_score,
        c.upvote_count AS comment_upvote_count,
        c.downvote_count AS comment_downvote_count,
        post_from_comment.id AS parent_post_id,
        post_from_comment.title AS parent_post_title,
        post_from_comment.body AS parent_post_body,

        u_cm.username AS moderator_username,
        u_cm.profile_picture_url AS moderator_pfp,

        ${reportCountExpr} AS report_count
      FROM "Report" AS r
      LEFT JOIN "User" AS u ON r.reporter_id = u.id
      LEFT JOIN "Comment" AS c ON r.comment_id = c.id
      LEFT JOIN "Post" AS p ON r.post_id = p.id
      LEFT JOIN "Post" AS post_from_comment ON c.post_id = post_from_comment.id
      LEFT JOIN "CommunityModerator" AS cm ON r.moderator_id = cm.id
      LEFT JOIN "User" AS u_cm ON cm.user_id = u_cm.id
      WHERE r.community_id = ${community_id}
      AND ${reportCountExpr} > 0
      ${andClause}
      ${typeFilter}
      ${cursorQuery}
      ${orderByClause}
      LIMIT ${take}
    `;

    const lastReport = reports?.[reports.length - 1];
    return {
      reports: formatReports(reports),
      pagination: {
        hasMore: reports?.length === take,
        nextCursor: {
          lastScore: sortByType === 'top' ? lastReport?.report_count : null,
          lastDate: sortByType === 'new' ? lastReport?.created_at : null,
          lastId: lastReport?.id ?? null,
        },
      },
    };
  }

  async alreadyReported(
    type: 'POST' | 'COMMENT',
    user_id: string,
    item_id: string,
  ) {
    const count = await this.prisma.report.count({
      where: {
        item_type: type,
        reporter_id: user_id,
        ...(type === 'POST' ? { post_id: item_id } : { comment_id: item_id }),
      },
    });

    return count > 0;
  }

  async report(
    type: 'POST' | 'COMMENT',
    user_id: string,
    item_id: string,
    community_id: string,
    subject: string,
    reason: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // Create report
      const report = await tx.report.create({
        data: {
          item_type: type,
          community_id,
          reporter_id: user_id,
          ...(type === 'POST' ? { post_id: item_id } : { comment_id: item_id }),
          subject,
          reason,
          status: 'PENDING',
        },
      });

      // Increment report number
      if (type === 'POST') {
        await tx.post.update({
          where: { id: item_id },
          data: {
            times_reported: { increment: 1 },
          },
        });
      } else if (type === 'COMMENT') {
        await tx.comment.update({
          where: { id: item_id },
          data: {
            times_reported: { increment: 1 },
          },
        });
      }

      return report;
    });
  }

  async updateAllPendingReports(
    item_id: string,
    moderator_id: string,
    type: 'POST' | 'COMMENT',
    status: 'REVIEWED' | 'DISMISSED',
    dismissReason?: string,
  ) {
    await this.prisma.report.updateMany({
      where: {
        status: 'PENDING',
        ...(type === 'POST' && { post_id: item_id }),
        ...(type === 'COMMENT' && { comment_id: item_id }),
      },
      data: {
        status,
        moderator_id,
        moderated_at: new Date(),
        removal_reason: dismissReason,
      },
    });
  }
}

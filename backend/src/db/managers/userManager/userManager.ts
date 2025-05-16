import { Prisma, PrismaClient, User } from '@prisma/client/default';
import bcrypt from 'bcrypt';
import formatUserHistory from '@/db/managers/userManager/util/formatUserHistory';

type HistoryItemBase = {
  record_type: 'post' | 'comment';
  id: string;
  created_at: Date;
  updated_at: Date;
  vote_score: number;
  user_id: string | null;
  is_deleted: boolean;
  edited_at: Date | null;
  upvote_count: number;
  downvote_count: number;
  times_reported: number;

  // Report
  report_id: string | null;
  report_item_type: string | null;
  report_reporter_id: string | null;
  report_subject: string | null;
  report_reason: string | null;
  report_created_at: string | null;
  report_status: string | null;
  report_moderator_id: string | null;
  report_moderated_at: string | null;
  report_removal_reason: string | null;
  report_community_id: string | null;
  report_post_id: string | null;
  report_comment_id: string | null;
};
type PostHistory = HistoryItemBase & {
  record_type: 'post';
  title: string;
  content: string;
  community_id: string;
  post_id: null;
  parent_comment_id: null;
  deleted_at: Date | null;
  is_spoiler: boolean;
  is_mature: boolean;
  pinned_at: Date | null;
  total_comment_score: number;
  lock_comments: boolean;
  post_type: string;

  poster_username: string | null;

  community_name: string;
  community_pfp: string | null;

  vote_user_id: string | null;
  vote_type: 'UPVOTE' | 'DOWNVOTE';
  membership_user_id: string | null;
};
type CommentHistory = HistoryItemBase & {
  record_type: 'comment';
  title: string;
  content: string;
  community_id: null;
  post_id: string;
  parent_comment_id: string | null;
  deleted_at: null;
  is_spoiler: null;
  is_mature: null;
  pinned_at: null;
  total_comment_score: null;
  lock_comments: null;
  post_type: null;

  poster_username: string | null;

  community_name: string;
  community_pfp: string | null;

  vote_user_id: string | null;
  vote_type: 'UPVOTE' | 'DOWNVOTE';
};

export type UserHistory = PostHistory | CommentHistory;

export default class UserManager {
  constructor(private prisma: PrismaClient) {}

  // ! READ
  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  async getByUsernameAndHistory(
    requestUserId: string | undefined,
    user_id: string,
    sortByType: 'new' | 'top',
    cursor: {
      lastId: string | undefined;
      lastScore: number | undefined;
      lastDate: string | undefined;
    },
    typeFilter: 'both' | 'posts' | 'comments',
    isInitialFetch: boolean,
    take = 30,
  ) {
    let typeFilterQuery = Prisma.sql``;
    let orderByClause = Prisma.sql``;
    let cursorQuery = Prisma.sql``;
    let user = null;

    if (isInitialFetch) {
      user = await this.prisma.$queryRaw<User[]>`
      SELECT
        u.id AS id,
        u.username AS username,
        u.email AS email,
        0 AS password,
        u.display_name AS display_name,
        u.profile_picture_url AS profile_picture_url,
        u.description AS description,
        u.cake_day AS cake_day,
        u.created_at AS created_at,
        u.deleted_at AS deleted_at,
        u.is_mature AS is_mature,
        u.post_karma AS post_karma,
        u.comment_karma AS comment_karma
      FROM "User" AS u
      WHERE u.id = ${user_id};
    `;
    }

    // Filtering by type
    if (typeFilter === 'posts') {
      typeFilterQuery = Prisma.sql`ch.record_type = 'post'`;
    } else if (typeFilter === 'comments') {
      typeFilterQuery = Prisma.sql`ch.record_type = 'comment'`;
    }

    // Filtering by date
    if (sortByType === 'new') {
      orderByClause = Prisma.sql`
        ORDER BY ch.created_at DESC
      `;
    } else if (sortByType === 'top') {
      orderByClause = Prisma.sql`
        ORDER BY ch.vote_score DESC, ch.id DESC
      `;
    }

    // Build cursor conditions
    let hasCursorCondition = false;
    if (cursor.lastId) {
      if (cursor.lastDate && sortByType === 'new') {
        cursorQuery = Prisma.sql`
          (ch.created_at < ${cursor.lastDate}::timestamp
          OR (ch.created_at = ${cursor.lastDate}::timestamp
          AND ch.id < ${cursor.lastId}))
        `;
        hasCursorCondition = true;
      } else if (cursor.lastScore !== undefined && sortByType === 'top') {
        cursorQuery = Prisma.sql`
          (ch.vote_score < ${cursor.lastScore}
          OR (ch.vote_score = ${cursor.lastScore}
          AND ch.id < ${cursor.lastId}))
        `;
        hasCursorCondition = true;
      }
    }

    // Build the WHERE clause
    let whereClause = Prisma.sql``;
    if (typeFilter !== 'both' && hasCursorCondition) {
      whereClause = Prisma.sql`WHERE ${cursorQuery} AND ${typeFilterQuery}`;
    } else if (typeFilter !== 'both') {
      whereClause = Prisma.sql`WHERE ${typeFilterQuery}`;
    } else if (hasCursorCondition) {
      whereClause = Prisma.sql`WHERE ${cursorQuery}`;
    }

    // TODO: Exclude removed by moderation?

    const history = await this.prisma.$queryRaw<UserHistory[]>`
      WITH combined_history AS (
        SELECT
          'post' AS record_type,
          p.id AS id,
          p.created_at AS created_at,
          p.updated_at AS updated_at,
          p.total_vote_score AS vote_score,
          p.title AS title,
          p.body AS content,
          p.poster_id AS user_id,
          p.community_id AS community_id,
          NULL AS post_id,
          NULL AS parent_comment_id,
          p.deleted_at AS deleted_at,
          NULL AS is_deleted,
          p.edited_at AS edited_at,
          p.is_spoiler AS is_spoiler,
          p.is_mature AS is_mature,
          p.pinned_at AS pinned_at,
          p.upvote_count AS upvote_count,
          p.downvote_count AS downvote_count,
          p.total_comment_score AS total_comment_score,
          p.lock_comments AS lock_comments,
          p.post_type AS post_type,
          p.times_reported AS times_reported,

          -- Poster
          NULL AS poster_username,
          -- Community
          pc.name AS community_name,
          pc.profile_picture_url AS community_pfp,
          -- Voting
          pv.user_id AS vote_user_id,
          pv.vote_type AS vote_type,
          -- Membership
          (SELECT uc.user_id FROM "UserCommunity" AS uc
          WHERE uc.community_id = p.community_id 
          AND uc.user_id = ${requestUserId} 
          LIMIT 1) AS membership_user_id,
          -- Reports
          r.id AS report_id,
          r.item_type AS report_item_type,
          r.reporter_id AS report_reporter_id,
          r.subject AS report_subject,
          r.reason AS report_reason,
          r.created_at AS report_created_at,
          r.status AS report_status,
          r.moderator_id AS report_moderator_id,
          r.moderated_at AS report_moderated_at,
          r.removal_reason AS report_removal_reason,
          r.community_id AS report_community_id,
          r.post_id AS report_post_id,
          r.comment_id AS report_comment_id


        FROM "Post" AS p
        LEFT JOIN "Community" AS pc ON pc.id = p.community_id
        LEFT JOIN "PostVote" AS pv on pv.post_id = p.id AND pv.user_id = ${requestUserId}
        LEFT JOIN "Report" AS r ON r.post_id = p.id AND reporter_id = ${requestUserId}

        WHERE p.poster_id = ${user_id} 
        AND (
            pc.type != 'PRIVATE' 
            OR 
            EXISTS (
                SELECT 1 FROM "UserCommunity" AS uc
                WHERE uc.community_id = pc.id 
                AND uc.user_id = ${requestUserId}
            )
        )
        
        UNION ALL
        
        SELECT
          'comment' AS record_type,
          c.id AS id,
          c.created_at AS created_at,
          c.updated_at AS updated_at,
          c.total_vote_score AS vote_score,
          p.title AS title,
          c.content AS content,
          c.user_id AS user_id,
          NULL AS community_id,
          c.post_id AS post_id,
          c.parent_comment_id AS parent_comment_id,
          NULL AS deleted_at,
          c.is_deleted AS is_deleted,
          c.edited_at AS edited_at,
          NULL AS is_spoiler,
          NULL AS is_mature,
          NULL AS pinned_at,
          c.upvote_count AS upvote_count,
          c.downvote_count AS downvote_count,
          NULL AS total_comment_score,
          NULL AS lock_comments,
          NULL AS post_type,
          c.times_reported AS times_reported,
          
          -- Poster
          u.username AS poster_username,
          -- Community
          cc.name AS community_name,
          cc.profile_picture_url AS community_pfp,
          -- Voting
          cv.user_id AS vote_user_id,
          cv.vote_type AS vote_type,
          -- Membership
          NULL AS membership_user_id,
          -- Reports
          r.id AS report_id,
          r.item_type AS report_item_type,
          r.reporter_id AS report_reporter_id,
          r.subject AS report_subject,
          r.reason AS report_reason,
          r.created_at AS report_created_at,
          r.status AS report_status,
          r.moderator_id AS report_moderator_id,
          r.moderated_at AS report_moderated_at,
          r.removal_reason AS report_removal_reason,
          r.community_id AS report_community_id,
          r.post_id AS report_post_id,
          r.comment_id AS report_comment_id

        FROM "Comment" AS c
        LEFT JOIN "Post" AS p ON p.id = c.post_id
        LEFT JOIN "Community" AS cc ON cc.id = p.community_id 
        LEFT JOIN "CommentVote" AS cv ON cv.comment_id = c.id AND cv.user_id = ${requestUserId}
        LEFT JOIN "User" AS u ON u.id = p.poster_id
        LEFT JOIN "Report" AS r ON r.comment_id = c.id

        WHERE c.user_id = ${user_id}
        AND cc.type != 'PRIVATE'
      )
      
      SELECT * FROM combined_history AS ch
      ${whereClause}
      ${orderByClause}
      LIMIT ${take};
    `;

    const lastItem = history?.[history.length - 1];
    return {
      user: user?.[0] ?? null,
      history: formatUserHistory(history),
      pagination: {
        hasMore: history?.length === take,
        nextCursor: {
          lastScore: sortByType === 'top' ? lastItem?.vote_score : null,
          lastDate: sortByType === 'new' ? lastItem?.created_at : null,
          lastId: lastItem?.id ?? null,
        },
      },
    };
  }

  async getSettings(user_id: string, check_existence = false) {
    const userWithPassword = await this.prisma.user.findUnique({
      where: { id: user_id },
      include: { user_settings: true },
    });
    const userSettings = await this.prisma.userSettings.findUnique({
      where: { user_id },
    });

    if (!userWithPassword) {
      if (check_existence) {
        throw new Error('User not found');
      }
      return null;
    }

    const userWithoutPassword = {
      ...userWithPassword,
      password: null,
    };
    return {
      user: userWithoutPassword,
      userSettings,
    };
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  // ! CREATE
  async create(
    username: string,
    email: string,
    hashedPassword: string,
    display_name?: string,
    profile_picture_url?: string,
    cake_day?: string,
  ) {
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        display_name,
        profile_picture_url,
        cake_day,
      },
    });

    await this.prisma.userSettings.create({
      data: { user_id: user.id },
    });
  }

  // ! UPDATE
  async edit(
    user_id: string,
    updateData: Partial<{
      email: string;
      password: string;
      display_name: string | null;
      description: string | null;
      profile_picture_url: string | null;
      cake_day: string | null;
    }>,
    settingsData?: Partial<{
      community_enabled: boolean;
      posts_enabled: boolean;
      comments_enabled: boolean;
      mods_enabled: boolean;
      chats_enabled: boolean;
      follows_enabled: boolean;
    }>,
  ) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.prisma.user.update({
      where: { id: user_id },
      data: updateData,
    });

    if (settingsData) {
      await this.prisma.userSettings.update({
        where: { user_id },
        data: settingsData,
      });
    }
  }

  // ! DELETE
  async delete(user_id: string) {
    await this.prisma.communityModerator.deleteMany({ where: { user_id } });

    await this.prisma.recentCommunities.deleteMany({ where: { user_id } });

    await this.prisma.user.update({
      where: { id: user_id },
      data: {
        deleted_at: new Date(),
        username: `deleted_${user_id.substring(0, 8)}`,
        email: `deleted_${user_id}@deleted.com`,
        password: '',
        display_name: null,
        profile_picture_url: null,
        description: null,
        cake_day: null,
      },
    });
  }
}

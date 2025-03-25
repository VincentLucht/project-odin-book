import { PrismaClient, Prisma, Community } from '@prisma/client/default';
import {
  transformPostsSearch,
  transformCommentsSearch,
} from '@/db/managers/misc/util/transform';

export default class SearchResultsManager {
  constructor(private prisma: PrismaClient) {}

  // ! POSTS
  /**
   * Searches communities and sorts them based on the post name.
   * Exact matches have priority, followed by case-insensitive matches, then contains matches, and finally everything else.
   */
  async searchPostsByRelevance(
    post_name: string,
    safeSearch: boolean,
    timeframe: Date | null,
    take = 30,
    offset = 0,
  ) {
    const queriedPosts = await this.prisma.$queryRaw`
      SELECT p.*, c.name AS community_name, c.profile_picture_url, c.is_mature AS community_is_mature, c.type as community_type
      FROM "Post" AS p
      INNER JOIN "Community" AS c ON c.id = p.community_id 
      WHERE p.title ILIKE ${`%${post_name}%`}
        AND NOT c.type = 'PRIVATE'
        ${timeframe ? Prisma.sql`AND p.created_at >= ${timeframe}` : Prisma.sql``}
        ${safeSearch ? Prisma.sql`AND NOT p.is_mature AND NOT c.is_mature` : Prisma.sql``}
        ORDER BY 
          CASE WHEN p.title = ${post_name} THEN 1 
              WHEN lower(p.title) = lower(${post_name}) THEN 2 
              WHEN p.title ILIKE ${`${post_name}%`} THEN 3 
              WHEN p.title ILIKE ${`%${post_name}%`} THEN 4 
              ELSE 5 
          END,
          p.created_at ASC,
          p.id ASC      
      LIMIT ${take} OFFSET ${offset}
    `;

    const posts = transformPostsSearch(queriedPosts as any);

    return posts;
  }

  async searchPostsByNew(
    post_name: string,
    safeSearch: boolean,
    cursorId?: string,
    take = 30,
  ) {
    const posts = await this.prisma.post.findMany({
      where: {
        title: { contains: post_name, mode: 'insensitive' },
        community: {
          type: { not: 'PRIVATE' },
          ...(safeSearch && { is_mature: false }),
        },
        ...(safeSearch && { is_mature: false }),
      },
      include: {
        community: {
          select: {
            name: true,
            profile_picture_url: true,
            type: true,
            is_mature: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take,
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
    });

    return posts;
  }

  /**
   * Sorts by the total vote score.
   */
  async searchPostsByTop(
    post_name: string,
    safeSearch: boolean,
    timeframe: Date | null,
    cursorId?: string,
    take = 30,
  ) {
    const posts = await this.prisma.post.findMany({
      where: {
        title: { contains: post_name, mode: 'insensitive' },
        community: {
          type: { not: 'PRIVATE' },
          ...(safeSearch && { is_mature: false }),
        },
        ...(safeSearch && { is_mature: false }),
        ...(timeframe && { created_at: { gte: timeframe } }),
      },
      include: {
        community: {
          select: {
            name: true,
            profile_picture_url: true,
            type: true,
            is_mature: true,
          },
        },
      },
      orderBy: { total_vote_score: 'desc' },
      take,
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
    });

    return posts;
  }

  // ! COMMUNITIES
  /**
   * Includes private communities, but only their name and total members, so that users can send join requests.
   */
  async searchCommunities(
    community_name: string,
    safeSearch: boolean,
    take = 30,
    offset = 0,
  ) {
    const queriedCommunities = await this.prisma.$queryRaw<Community[]>`
      SELECT *
      FROM "Community"
      WHERE name ILIKE ${`%${community_name}%`}
        ${safeSearch ? Prisma.sql`AND NOT is_mature` : Prisma.sql``}
      ORDER BY
        CASE
          WHEN name = ${community_name} THEN 1
          WHEN lower(name) = lower(${community_name}) THEN 2
          WHEN name ILIKE ${`${community_name}%`} THEN 3
          WHEN name ILIKE ${`%${community_name}%`} THEN 4
          ELSE 5
        END,
        created_at ASC,
        id ASC
      LIMIT ${take} OFFSET ${offset}
    `;

    const communities = queriedCommunities.map((community) => {
      if (community.type === 'PRIVATE') {
        return {
          name: community.name,
          total_members: community.total_members,
          type: 'PRIVATE',
        };
      }

      return community;
    });

    return communities;
  }

  // ! COMMENTS
  async searchCommentsByRelevance(
    comment_content: string,
    safeSearch: boolean,
    timeframe: Date | null,
    take = 30,
    offset = 0,
  ) {
    const queriedComments = await this.prisma.$queryRaw`
      SELECT 
        c.*, 
          cmty.type AS community_type,
          cmty.name AS community_name, 
          cmty.profile_picture_url AS community_profile_picture_url, 
          p.id AS post_id, 
          p.title AS post_title,
          p.created_at AS post_created_at,
          p.total_comment_score AS post_total_comment_score,
          p.total_vote_score AS post_total_vote_score,
          p.is_mature AS post_is_mature, 
          p.is_spoiler AS post_is_spoiler,
          p.community_id AS post_community_id,
          u.username,
          u.profile_picture_url AS user_pfp
      FROM "Comment" AS c
        INNER JOIN "Post" AS p ON p.id = c.post_id
        INNER JOIN "Community" AS cmty ON cmty.id = p.community_id
        INNER JOIN "User" AS u ON u.id = c.user_id
      WHERE 
        c.content ILIKE ${`%${comment_content}%`}
        ${safeSearch ? Prisma.sql`AND NOT p.is_mature` : Prisma.sql``}
        ${timeframe ? Prisma.sql`AND c.created_at >= ${timeframe}` : Prisma.sql``}
      ORDER BY
        CASE
          WHEN c.content = ${comment_content} THEN 1
          WHEN lower(c.content) = lower(${comment_content}) THEN 2
          WHEN c.content ILIKE ${`${comment_content}%`} THEN 3
          WHEN c.content ILIKE ${`%${comment_content}%`} THEN 4
          ELSE 5
        END,
        c.created_at ASC,
        p.id ASC
      LIMIT ${take} OFFSET ${offset}
    `;

    const comments = transformCommentsSearch(queriedComments as any);
    return comments;
  }

  async searchCommentsByNew(
    comment_content: string,
    safeSearch: boolean,
    cursorId?: string,
    take = 30,
  ) {
    const comments = await this.prisma.comment.findMany({
      where: {
        content: { contains: comment_content, mode: 'insensitive' },
        post: {
          community: { NOT: { type: 'PRIVATE' } },
          ...(safeSearch && { is_mature: false }),
        },
      },
      include: {
        post: {
          select: {
            community: {
              select: { name: true, profile_picture_url: true, type: true },
            },
            id: true,
            title: true,
            created_at: true,
            total_comment_score: true,
            total_vote_score: true,
            is_mature: true,
            is_spoiler: true,
          },
        },
        user: {
          select: {
            profile_picture_url: true,
            username: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take,
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
    });

    return comments;
  }

  /**
   * Sorts by the total vote score.
   */
  async searchCommentsByTop(
    comment_content: string,
    safeSearch: boolean,
    timeframe: Date | null,
    cursorId?: string,
    take = 30,
  ) {
    const comments = await this.prisma.comment.findMany({
      where: {
        content: { contains: comment_content, mode: 'insensitive' },
        post: {
          community: { NOT: { type: 'PRIVATE' } },
          ...(timeframe && { created_at: { gte: timeframe } }),
          ...(safeSearch && { is_mature: false }),
        },
      },
      include: {
        post: {
          select: {
            community: {
              select: { name: true, profile_picture_url: true, type: true },
            },
            id: true,
            title: true,
            created_at: true,
            total_comment_score: true,
            total_vote_score: true,
            is_mature: true,
            is_spoiler: true,
          },
        },
        user: {
          select: {
            profile_picture_url: true,
            username: true,
          },
        },
      },
      orderBy: { total_vote_score: 'desc' },
      take,
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
    });

    return comments;
  }

  // ! USERS
  async searchUsers(
    username: string,
    safeSearch: boolean,
    take = 30,
    offset = 0,
  ) {
    const users = await this.prisma.$queryRaw`
      SELECT
        id,
        username,
        email,
        NULL as password,
        display_name,
        profile_picture_url,
        description,
        created_at,
        cake_day,
        deleted_at,
        comment_karma,
        post_karma,
        is_mature
      FROM "User"
      WHERE username ILIKE ${`%${username}%`}
      ${safeSearch ? Prisma.sql`AND NOT is_mature` : Prisma.sql``}
      ORDER BY
      CASE
        WHEN username = ${username} THEN 1
        WHEN lower(username) = lower(${username}) THEN 2
        WHEN username ILIKE ${`${username}%`} THEN 3
        WHEN username ILIKE ${`%${username}%`} THEN 4
        ELSE 5
      END,
      created_at ASC,
      id ASC
      LIMIT ${take} OFFSET ${offset}
    `;

    return users;
  }
}

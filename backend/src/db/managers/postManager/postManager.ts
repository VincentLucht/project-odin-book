import { getPostInfo } from '@/db/managers/communityManager/util/baseQuery';
import { PostType, PrismaClient } from '@prisma/client/default';
import { postSelectFields } from '@/db/managers/postManager/util/postUtils';
import { TimeFrame } from '@/db/managers/util/types';
import createSortParams from '@/util/paginationUtils';
import { getCommunityInfo } from '@/db/managers/communityManager/util/baseQuery';

export default class PostManager {
  constructor(private prisma: PrismaClient) {}
  // ! GET
  async getById(post_id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: post_id },
    });

    return post;
  }

  async getByIdAndModerator(post_id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: post_id },
      include: {
        moderation: true,
      },
    });

    return post;
  }

  async getByIdAndCommunity(
    post_id: string,
    community_id: string,
    user_id: string | undefined,
  ) {
    const postAndCommunity = await this.prisma.post.findUnique({
      where: { id: post_id },
      select: {
        ...postSelectFields,
        poster: {
          select: { username: true, deleted_at: true },
        },
        ...(user_id && {
          post_votes: {
            where: { user_id },
            select: { user_id: true, vote_type: true },
          },
        }),
        post_assigned_flair: {
          select: {
            id: true,
            community_flair: true,
          },
        },
        lock_comments: true,
        moderation: {
          include: {
            moderator: {
              select: {
                user: { select: { username: true, profile_picture_url: true } },
              },
            },
          },
        },
        reports: {
          where: { reporter_id: user_id, post_id },
        },
        community: getCommunityInfo('', community_id, user_id, false),
      },
    });

    return postAndCommunity;
  }

  /**
   * Pagination based post fetching. Can fetch by new or top.
   */
  async getBy(
    community_id: string,
    sortBy: 'new' | 'top',
    requestUserId: string | undefined,
    cursorId?: string,
    timeframe?: TimeFrame,
    take = 30,
  ) {
    const { orderBy, convertedTimeframe } = createSortParams(sortBy, timeframe);

    const posts = await this.prisma.post.findMany({
      where: {
        community_id,
        deleted_at: null,
        ...(convertedTimeframe && sortBy === 'top'
          ? {
              created_at: { gte: convertedTimeframe },
            }
          : {}),
      },
      orderBy,
      include: getPostInfo(requestUserId),
      ...(cursorId && {
        cursor: {
          id: cursorId,
        },
        skip: 1,
      }),
      take,
    });

    const lastPost = posts[posts.length - 1];
    const nextCursor = lastPost?.id;

    return {
      posts,
      pagination: {
        nextCursor,
        hasMore: posts.length === take,
      },
    };
  }

  async getPopular(
    sortBy: 'new' | 'top',
    requestUserId: string | undefined,
    timeframe: TimeFrame,
    cursorId?: string,
    take = 30,
  ) {
    const { orderBy, convertedTimeframe } = createSortParams(sortBy, timeframe);

    const posts = await this.prisma.post.findMany({
      where: {
        deleted_at: null,
        is_mature: false,
        is_spoiler: false,
        OR: [
          { moderation: null },
          { moderation: { action: { not: 'REMOVED' } } },
        ],
        community: { type: { not: 'PRIVATE' } },
        ...(convertedTimeframe && sortBy === 'top'
          ? {
              created_at: { gte: convertedTimeframe },
            }
          : {}),
      },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            profile_picture_url: true,
            user_communities: {
              where: { user_id: requestUserId },
              select: { user_id: true, role: true },
            },
          },
        },
        ...getPostInfo(requestUserId, false),
      },
      ...(cursorId && {
        cursor: {
          id: cursorId,
        },
        skip: 1,
      }),
      orderBy,
      take,
    });

    const lastPost = posts[posts.length - 1];
    const nextCursor = lastPost?.id;

    return {
      posts,
      pagination: {
        nextCursor,
        hasMore: posts.length === take,
      },
    };
  }

  // ! POST
  async create(
    community_id: string,
    poster_id: string,
    title: string,
    body: string,
    is_spoiler: boolean,
    is_mature: boolean,
    post_type: PostType,
    flair_id: string | undefined,
  ) {
    const post = await this.prisma.post.create({
      data: {
        community_id,
        poster_id,
        title,
        body,
        is_spoiler,
        is_mature,
        post_type,
        ...(flair_id && {
          post_assigned_flair: {
            create: {
              community_flair_id: flair_id,
            },
          },
        }),
      },
    });

    return post;
  }

  // ! PUT
  async edit(
    post_id: string,
    body: string,
    is_spoiler: boolean,
    is_mature: boolean,
  ) {
    await this.prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        body,
        is_spoiler,
        edited_at: new Date().toISOString(),
        is_mature,
      },
    });
  }

  // ! DELETE
  async deletePost(post_id: string) {
    await this.prisma.post.update({
      where: { id: post_id },
      data: {
        deleted_at: new Date().toISOString(),
        poster_id: null,
        body: '',
        pinned_at: null,
      },
    });
  }
}

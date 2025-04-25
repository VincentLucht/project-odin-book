import { Prisma } from '@prisma/client';
const { SortOrder } = Prisma;

export function getPostInfo(
  requestUserId: string | undefined,
  includeModeration = true,
) {
  return {
    ...(requestUserId && {
      post_votes: {
        where: { user_id: requestUserId },
        select: { user_id: true, vote_type: true },
      },
    }),
    poster: {
      select: {
        id: true,
        username: true,
        profile_picture_url: true,
        deleted_at: true,
      },
    },
    post_assigned_flair: {
      select: {
        id: true,
        community_flair: true,
      },
    },
    reports: {
      where: { reporter_id: requestUserId },
    },
    ...(includeModeration && {
      moderation: {
        include: {
          moderator: {
            select: {
              user: { select: { username: true, profile_picture_url: true } },
            },
          },
        },
      },
    }),
  };
}

export function getCommunityInfo(
  communityName: string,
  communityId: string,
  requestUserId: string | undefined,
  includeWhere = true,
) {
  // Create the base obj
  const queryInfo: any = {
    include: {
      ...(requestUserId && {
        community_moderators: {
          where: { user_id: requestUserId },
          select: {
            user: {
              select: { id: true, username: true, profile_picture_url: true },
            },
          },
        },
        user_communities: {
          where: { user_id: requestUserId },
          select: { user_id: true, role: true },
        },
      }),
      community_moderators: {
        select: {
          is_active: true,
          user: {
            select: {
              id: true,
              username: true,
              profile_picture_url: true,
              user_assigned_flair: {
                where: {
                  community_flair: {
                    community_id: communityId,
                  },
                },
                select: { id: true, community_flair: true },
              },
            },
          },
        },
        take: 10,
      },
      community_rules: true,
    },
  };

  // Always add the where clause for findUnique
  if (includeWhere) {
    queryInfo.where = { name: communityName };
  }

  return queryInfo;
}

export default function baseQuery(
  name: string,
  requestUserId: string | undefined,
  communityId: string,
  options: {
    sort: 'new' | 'hot' | 'top';
    timeFilter?: Date;
    cursor?: string; // TODO: Remove useless cursor???
    limit?: number;
  },
) {
  const take = options.limit ?? 30;

  const pagination = options.cursor
    ? {
        cursor: {
          id: options.cursor,
        },
        skip: 1, // ? skip cursor item
        take,
      }
    : options.sort !== 'hot'
      ? { take }
      : {};

  return {
    where: { name },
    include: {
      ...(requestUserId && {
        community_moderators: {
          where: { user_id: requestUserId },
          select: {
            user: {
              select: { id: true, username: true, profile_picture_url: true },
            },
          },
        },
        user_communities: {
          where: { user_id: requestUserId },
          select: { user_id: true, role: true },
        },
      }),
      community_moderators: {
        select: {
          is_active: true,
          user: {
            select: {
              id: true,
              username: true,
              profile_picture_url: true,
              user_assigned_flair: {
                where: {
                  community_flair: {
                    community_id: communityId,
                  },
                },
                select: { id: true, community_flair: true },
              },
            },
          },
        },
        take: 10,
      },
      community_rules: true,
      posts: {
        ...pagination,
        include: getPostInfo(requestUserId),
        where: {
          deleted_at: null,
          OR: [
            { moderation: null },
            { moderation: { action: { not: 'REMOVED' } } },
          ] as any,
          ...(options.timeFilter && {
            created_at: { gte: options.timeFilter },
          }),
        },
        ...(options.sort === 'new' && {
          orderBy: {
            created_at: SortOrder.desc,
          },
        }),
        ...(options.sort === 'top' && {
          orderBy: {
            total_vote_score: SortOrder.desc,
          },
        }),
      },
    },
  };
}

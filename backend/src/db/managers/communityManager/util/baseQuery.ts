import { Prisma } from '@prisma/client';
const { SortOrder } = Prisma;

export default function baseQuery(
  name: string,
  requestUserId: string | undefined,
  options: {
    sort: 'new' | 'hot' | 'top';
    timeFilter?: Date;
    cursor?: string;
    limit?: number;
  },
) {
  const take = options.limit ?? 30;

  const pagination = options.cursor
    ? {
        cursor: {
          id: options.cursor,
          skip: 1, // ? skip cursor item
          take,
        },
      }
    : {};

  return {
    where: { name },
    include: {
      ...(requestUserId && {
        user_communities: {
          where: { user_id: requestUserId },
          select: { user_id: true, role: true },
        },
      }),
      posts: {
        ...pagination,
        include: {
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
            },
          },
          community: {
            select: {
              id: true,
              name: true,
              profile_picture_url: true,
              ...(requestUserId && {
                user_communities: {
                  where: { user_id: requestUserId },
                  select: { user_id: true },
                },
              }),
            },
          },
        },
        where: {
          deleted_at: null,
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

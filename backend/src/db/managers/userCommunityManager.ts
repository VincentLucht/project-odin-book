import { TimeFrame } from '@/db/managers/util/types';
import createSortParams from '@/util/paginationUtils';
import { getPostInfo } from '@/db/managers/communityManager/util/baseQuery';
import { PrismaClient, UserRole } from '@prisma/client/default';

export default class UserCommunityManager {
  constructor(private prisma: PrismaClient) {}

  // ! GET
  async isMember(user_id: string, community_id: string) {
    const count = await this.prisma.userCommunity.count({
      where: { user_id, community_id },
    });
    return count > 0;
  }

  async getById(user_id: string, community_id: string) {
    const member = await this.prisma.userCommunity.findUnique({
      where: {
        user_id_community_id: {
          user_id,
          community_id,
        },
      },
    });

    return member;
  }

  async getJoinedCommunities(user_id: string, offset: number, limit: number) {
    const joinedCommunities = await this.prisma.userCommunity.findMany({
      where: { user_id },
      skip: offset,
      take: limit,
      orderBy: {
        community: {
          name: 'asc',
        },
      },
      select: {
        community: {
          select: {
            id: true,
            name: true,
            profile_picture_url: true,
          },
        },
      },
    });

    return joinedCommunities;
  }

  /**
   * Fetch joined communities via pagination. Can fetch by new or top.
   */
  async fetchHomePageBy(
    user_id: string,
    sortBy: 'new' | 'top',
    timeframe: TimeFrame,
    cursorId: string | undefined,
    take = 30,
  ) {
    const { orderBy, convertedTimeframe } = createSortParams(sortBy, timeframe);

    const homepage = await this.prisma.post.findMany({
      where: {
        OR: [
          { moderation: null },
          { moderation: { action: { not: 'REMOVED' } } },
        ],
        community: {
          user_communities: {
            some: {
              user_id,
            },
          },
        },
        deleted_at: null,
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
              where: { user_id },
              select: { user_id: true, role: true },
            },
          },
        },
        ...getPostInfo(user_id, false),
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

    const lastPost = homepage[homepage.length - 1];
    const nextCursor = lastPost?.id;

    return {
      homepage,
      pagination: {
        nextCursor,
        hasMore: homepage.length === take,
      },
    };
  }

  // ! CREATE
  async join(user_id: string, community_id: string) {
    await this.prisma.userCommunity.create({
      data: {
        user_id,
        community_id,
        role: UserRole.BASIC,
      },
    });
  }

  async leave(user_id: string, community_id: string) {
    await this.prisma.userCommunity.delete({
      where: {
        user_id_community_id: {
          user_id,
          community_id,
        },
      },
    });
  }
}

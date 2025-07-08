import { TimeFrame } from '@/db/managers/util/types';
import createSortParams from '@/util/paginationUtils';
import { getPostInfo } from '@/db/managers/communityManager/util/baseQuery';
import { Prisma, PrismaClient, UserRole } from '@prisma/client/default';
import formatCommunityMembers from '@/db/managers/userCommunityManager/util/formatCommunityMembers';

export default class UserCommunityManager {
  constructor(private prisma: PrismaClient) {}

  // ! GET
  async getMembers(
    community_id: string,
    cursorId: string | undefined,
    mode: 'users' | 'moderators' | 'banned' | 'approved' | 'all',
    take = 50,
  ) {
    const cursorQuery = cursorId
      ? {
          cursor: { id: cursorId },
          skip: 1,
        }
      : ({} as object);

    let members: any[] = [];

    if (mode === 'users') {
      members = await this.prisma.userCommunity.findMany({
        where: {
          community_id,
        },
        orderBy: [{ joined_at: 'asc' }, { id: 'asc' }],
        take,
        select: {
          id: true,
          joined_at: true,
          role: true,
          user: {
            select: {
              username: true,
              profile_picture_url: true,
              approved_users: {
                where: { community_id },
                select: { approved_at: true },
              },
              community_moderator: {
                where: { community_id },
                select: { is_active: true },
              },
            },
          },
        },
        ...cursorQuery,
      });
    } else if (mode === 'moderators') {
      members = await this.prisma.communityModerator.findMany({
        where: {
          community_id,
        },
        orderBy: [{ created_at: 'asc' }, { id: 'asc' }],
        take,
        select: {
          id: true,
          created_at: true,
          user: {
            select: {
              username: true,
              profile_picture_url: true,
              approved_users: {
                where: { community_id },
                select: { approved_at: true },
              },
            },
          },
        },
        ...cursorQuery,
      });
    } else if (mode === 'banned') {
      members = await this.prisma.bannedUser.findMany({
        where: {
          community_id,
        },
        orderBy: [{ banned_at: 'asc' }, { id: 'asc' }],
        take,
        select: {
          id: true,
          banned_at: true,
          ban_duration: true,
          ban_reason: true,
          user: {
            select: {
              username: true,
              profile_picture_url: true,
            },
          },
        },
        ...cursorQuery,
      });
    } else if (mode === 'approved') {
      members = await this.prisma.approvedUser.findMany({
        where: {
          community_id,
        },
        orderBy: [{ approved_at: 'asc' }, { id: 'asc' }],
        take,
        select: {
          id: true,
          approved_at: true,
          user: {
            select: {
              username: true,
              profile_picture_url: true,
              community_moderator: {
                where: { community_id },
                select: { is_active: true },
              },
            },
          },
        },
        ...cursorQuery,
      });
    }

    return {
      members: formatCommunityMembers(members, mode),
      pagination: {
        nextCursor: members[members.length - 1]?.id,
        hasMore: members.length === take,
      },
    };
  }

  async getMembersByName(
    community_id: string,
    username: string,
    mode: 'users' | 'moderators' | 'banned' | 'approved' | 'all',
    take = 30,
  ) {
    let members: any[] = [];

    const usernameOrderAndLimit = Prisma.sql`
      AND u.username ILIKE '%' || ${username} || '%'
      ORDER BY
        CASE
          WHEN u.username = ${username} THEN 1
          WHEN u.username ILIKE ${username} || '%' THEN 2
          WHEN u.username ILIKE '%' || ${username} || '%' THEN 3
          ELSE 5
        END
      LIMIT ${take}
    `;

    if (mode === 'users') {
      members = await this.prisma.$queryRaw`
        SELECT uc.id, uc.joined_at, uc.role, 
                u.username, u.profile_picture_url, 
                au.approved_at, 
                cm.is_active AS is_moderator
        FROM "UserCommunity" AS uc
        LEFT JOIN "User" AS u ON u.id = uc.user_id
        LEFT JOIN "ApprovedUser" AS au ON au.user_id = u.id AND au.community_id = ${community_id}
        LEFT JOIN "CommunityModerator" AS cm ON cm.user_id = u.id AND cm.community_id = ${community_id}
        WHERE uc.community_id = ${community_id}
        ${usernameOrderAndLimit}
      `;
    } else if (mode === 'moderators') {
      members = await this.prisma.$queryRaw`
        SELECT cm.id, cm.created_at,
                u.username, u.profile_picture_url,
                au.approved_at
        FROM "CommunityModerator" AS cm
        LEFT JOIN "User" AS u ON u.id = cm.user_id
        LEFT JOIN "ApprovedUser" AS au ON au.user_id = u.id AND au.community_id = ${community_id}
        WHERE cm.community_id = ${community_id}
        ${usernameOrderAndLimit}
      `;
    } else if (mode === 'banned') {
      members = await this.prisma.$queryRaw`
        SELECT bu.id, bu.banned_at, bu.ban_duration, bu.ban_reason,
                u.username, u.profile_picture_url
        FROM "BannedUser" AS bu
        LEFT JOIN "User" AS u ON u.id = bu.user_id
        WHERE bu.community_id = ${community_id}
        ${usernameOrderAndLimit}
      `;
    } else if (mode === 'approved') {
      members = await this.prisma.$queryRaw`
        SELECT au.id, au.approved_at, 
                u.username, u.profile_picture_url,
                cm.is_active AS is_moderator
        FROM "ApprovedUser" AS au
        LEFT JOIN "User" AS u ON u.id = au.user_id
        LEFT JOIN "CommunityModerator" AS cm ON cm.user_id = u.id AND cm.community_id = ${community_id}
        WHERE au.community_id = ${community_id}
        ${usernameOrderAndLimit}
      `;
    } else if (mode === 'all') {
      members = await this.prisma.$queryRaw`
        SELECT u.id, u.username, u.profile_picture_url, u.created_at,
                uc.joined_at, uc.role,
                au.approved_at,
                cm.is_active AS is_moderator,
                bu.banned_at, bu.ban_duration, bu.ban_reason
        FROM "User" AS u
        LEFT JOIN "UserCommunity" AS uc ON uc.user_id = u.id AND uc.community_id = ${community_id}
        LEFT JOIN "ApprovedUser" AS au ON au.user_id = u.id AND au.community_id = ${community_id}
        LEFT JOIN "CommunityModerator" AS cm ON cm.user_id = u.id AND cm.community_id = ${community_id}
        LEFT JOIN "BannedUser" AS bu ON bu.user_id = u.id AND bu.community_id = ${community_id}
        WHERE u.id IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM "BannedUser" AS bu2 
          WHERE bu2.user_id = u.id 
          AND bu2.community_id = ${community_id}
        )
        ${usernameOrderAndLimit}
      `;
    }

    return formatCommunityMembers(members, mode);
  }

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
    await this.prisma.$transaction([
      this.prisma.userCommunity.create({
        data: {
          user_id,
          community_id,
          role: UserRole.BASIC,
        },
      }),

      this.prisma.community.update({
        where: { id: community_id },
        data: {
          total_members: {
            increment: 1,
          },
        },
      }),
    ]);
  }

  async leave(user_id: string, community_id: string) {
    await this.prisma.$transaction([
      this.prisma.userCommunity.delete({
        where: {
          user_id_community_id: {
            user_id,
            community_id,
          },
        },
      }),

      this.prisma.community.update({
        where: { id: community_id },
        data: {
          total_members: {
            decrement: 1,
          },
        },
      }),
    ]);
  }
}

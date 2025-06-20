import { PrismaClient } from '@prisma/client/default';

export default class CommunityModeratorManager {
  constructor(private prisma: PrismaClient) {}

  // ! GET
  async fetch(community_id: string, cursorId: string, take = 30) {
    const moderators = await this.prisma.communityModerator.findMany({
      where: {
        community_id,
      },
      ...(cursorId && {
        cursor: {
          id: cursorId,
        },
        skip: 1,
      }),
      select: {
        id: true,
        user: {
          select: {
            username: true,
            profile_picture_url: true,
          },
        },
        created_at: true,
      },
      take,
      orderBy: {
        created_at: 'asc',
      },
    });

    return {
      moderators,
      pagination: {
        nextCursor: moderators[moderators.length - 1].id,
        hasMore: moderators.length === take,
      },
    };
  }

  async isMod(user_id: string, community_id: string) {
    const count = await this.prisma.communityModerator.count({
      where: { user_id, community_id },
    });
    return count > 0;
  }

  async getById(user_id: string, community_id: string) {
    const moderator = await this.prisma.communityModerator.findUnique({
      where: {
        community_id_user_id: { user_id, community_id },
      },
    });

    return moderator;
  }

  // ! CREATE
  async makeMod(community_id: string, target_user_id: string) {
    await this.prisma.communityModerator.create({
      data: {
        community_id,
        user_id: target_user_id,
        is_active: true,
      },
    });
  }

  // ! Update
  async activateMod(community_id: string, user_id: string) {
    await this.prisma.communityModerator.update({
      where: { community_id_user_id: { community_id, user_id } },
      data: { is_active: true },
    });
  }

  async deactivateMod(community_id: string, user_id: string) {
    await this.prisma.communityModerator.update({
      where: { community_id_user_id: { community_id, user_id } },
      data: { is_active: false },
    });
  }
}

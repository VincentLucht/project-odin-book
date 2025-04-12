import { PrismaClient } from '@prisma/client/default';

export default class CommunityModeratorManager {
  constructor(private prisma: PrismaClient) {}

  // ! GET
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

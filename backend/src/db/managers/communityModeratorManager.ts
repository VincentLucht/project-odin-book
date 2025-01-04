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

  // ! DELETE
  async delete(user_id: string, community_id: string) {
    await this.prisma.communityModerator.delete({
      where: { community_id_user_id: { user_id, community_id } },
    });
  }
}

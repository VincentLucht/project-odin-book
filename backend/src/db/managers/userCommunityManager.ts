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
}

import { PrismaClient } from '@prisma/client/default';

export default class BannedUsersManager {
  constructor(private prisma: PrismaClient) {}

  async isBanned(user_id: string, community_id: string) {
    const count = await this.prisma.bannedUser.count({
      where: { user_id, community_id },
    });
    return count > 0;
  }
}

import { PrismaClient } from '@prisma/client/default';

export default class BannedUsersManager {
  constructor(private prisma: PrismaClient) {}

  async isBanned(user_id: string, community_id: string) {
    const count = await this.prisma.bannedUser.count({
      where: { user_id, community_id },
    });
    return count > 0;
  }

  async ban(
    user_id: string,
    community_id: string,
    ban_duration: string | null,
    ban_reason: string,
  ) {
    console.log(ban_duration);

    await this.prisma.$transaction(async (tx) => {
      await tx.bannedUser.create({
        data: {
          user_id,
          community_id,
          ban_duration: ban_duration ? new Date(ban_duration) : null,
          ban_reason,
          banned_at: new Date(),
        },
      });

      await tx.approvedUser.deleteMany({
        where: {
          user_id,
          community_id,
        },
      });
    });
  }

  async unban(user_id: string, community_id: string) {
    await this.prisma.bannedUser.delete({
      where: {
        user_id_community_id: {
          user_id,
          community_id,
        },
      },
    });
  }
}

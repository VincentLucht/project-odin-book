import { PrismaClient } from '@prisma/client/default';

export default class ApprovedUserManager {
  constructor(private prisma: PrismaClient) {}

  async isApproved(user_id: string, community_id: string) {
    const result = await this.prisma.approvedUser.findUnique({
      where: {
        user_id_community_id: {
          user_id,
          community_id,
        },
      },
    });

    return result !== null;
  }

  async create(community_id: string, user_id: string) {
    await this.prisma.approvedUser.create({
      data: {
        community_id,
        user_id,
      },
    });
  }

  async delete(
    community_id: string,
    user_id: string,
    isPrivateCommunity: boolean,
  ) {
    return this.prisma.$transaction(async (tx) => {
      if (isPrivateCommunity) {
        await tx.userCommunity.delete({
          where: {
            user_id_community_id: {
              user_id,
              community_id,
            },
          },
        });
      }

      // TODO: Remove mod status?

      await tx.approvedUser.delete({
        where: { user_id_community_id: { community_id, user_id } },
      });
    });
  }
}

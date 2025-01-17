import { PrismaClient } from '@prisma/client/default';

export default class UserAssignedFlairManager {
  constructor(private prisma: PrismaClient) {}
  // ! GET
  async getById(user_assigned_flair_id: string) {
    const userFlair = await this.prisma.userAssignedFlair.findUnique({
      where: { id: user_assigned_flair_id },
    });

    return userFlair;
  }

  async getUserFlairInCommunity(user_id: string, community_id: string) {
    const userFlair = await this.prisma.userAssignedFlair.findFirst({
      where: {
        user_id,
        community_flair: {
          community_id,
        },
      },
    });

    return userFlair;
  }

  // ! POST
  async create(user_id: string, community_flair_id: string) {
    await this.prisma.userAssignedFlair.create({
      data: {
        user_id,
        community_flair_id,
      },
    });
  }

  // ! PUT
  async update(user_assigned_flair_id: string, community_flair_id: string) {
    await this.prisma.userAssignedFlair.update({
      where: {
        id: user_assigned_flair_id,
      },
      data: {
        community_flair_id,
      },
    });
  }

  // ! DELETE
  async delete(user_assigned_flair_id: string) {
    await this.prisma.userAssignedFlair.delete({
      where: { id: user_assigned_flair_id },
    });
  }
}

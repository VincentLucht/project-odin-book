import { PrismaClient } from '@prisma/client/default';

export default class JoinRequestManager {
  constructor(private prisma: PrismaClient) {}

  async hasRequested(community_id: string, user_id: string) {
    const hasRequested = await this.prisma.joinRequest.findUnique({
      where: { user_id_community_id: { user_id, community_id } },
    });

    return hasRequested;
  }

  async request(community_id: string, user_id: string) {
    await this.prisma.joinRequest.create({
      data: { community_id, user_id },
    });
  }

  async delete(community_id: string, user_id: string) {
    await this.prisma.joinRequest.delete({
      where: { user_id_community_id: { user_id, community_id } },
    });
  }
}

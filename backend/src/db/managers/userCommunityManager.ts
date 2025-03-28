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

  async leave(user_id: string, community_id: string) {
    await this.prisma.userCommunity.delete({
      where: {
        user_id_community_id: {
          user_id,
          community_id,
        },
      },
    });
  }
}

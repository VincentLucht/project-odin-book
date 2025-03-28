import { PrismaClient } from '@prisma/client/default';

export default class CommunityFlairManager {
  constructor(private prisma: PrismaClient) {}

  async doesExistByName(community_id: string, name: string) {
    const count = await this.prisma.communityFlair.count({
      where: { community_id, name },
    });
    return count > 0;
  }

  async getById(community_id: string, community_flair_id: string) {
    const flair = await this.prisma.communityFlair.findUnique({
      where: { community_id, id: community_flair_id },
    });

    return flair;
  }

  async getAllCommunityFlairs(community_id: string) {
    const allFlairs = await this.prisma.communityFlair.findMany({
      where: { community_id },
    });

    return allFlairs;
  }

  async getAllPostFlairs(community_id: string) {
    const allPostFlairs = await this.prisma.communityFlair.findMany({
      where: { community_id, is_assignable_to_posts: true },
    });

    return allPostFlairs;
  }

  async create(
    community_id: string,
    name: string,
    textColor: string,
    color: string,
    is_assignable_to_posts: boolean,
    is_assignable_to_users: boolean,
    emoji?: string,
  ) {
    const flair = await this.prisma.communityFlair.create({
      data: {
        community_id,
        textColor,
        name,
        color,
        is_assignable_to_posts,
        is_assignable_to_users,
        emoji,
      },
    });

    return flair;
  }
}

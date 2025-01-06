import { PrismaClient } from '@prisma/client/default';

export default class CommunityFlairManager {
  constructor(private prisma: PrismaClient) {}

  async doesExist(community_id: string, name: string) {
    const count = await this.prisma.communityFlair.count({
      where: { community_id, name },
    });
    return count > 0;
  }

  async create(
    community_id: string,
    name: string,
    color: string,
    is_assignable_to_posts: boolean,
    is_assignable_to_users: boolean,
    emoji?: string,
  ) {
    const flair = await this.prisma.communityFlair.create({
      data: {
        community_id,
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

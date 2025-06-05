import { PrismaClient } from '@prisma/client/default';

export default class RecentCommunitiesManager {
  constructor(private prisma: PrismaClient) {
    this.delete = this.delete.bind(this);
  }

  async get(user_id: string) {
    const recent = await this.prisma.recentCommunities.findMany({
      where: { user_id },
      orderBy: { interacted_at: 'desc' },
      include: {
        community: {
          select: {
            name: true,
            profile_picture_url: true,
          },
        },
      },
    });

    return recent;
  }

  async assign(user_id: string, community_id: string) {
    // Update if in recent
    await this.prisma.recentCommunities.upsert({
      where: {
        community_id_user_id: {
          community_id,
          user_id,
        },
      },
      update: {
        interacted_at: new Date(),
      },
      create: {
        user_id,
        community_id,
        interacted_at: new Date(),
      },
    });

    const recentCommunities = await this.prisma.recentCommunities.findMany({
      where: { user_id },
      orderBy: { interacted_at: 'desc' },
      select: {
        id: true,
        interacted_at: true,
        community: { select: { id: true, name: true } },
      },
    });

    // If limit hit, remove oldest
    if (recentCommunities.length > 5) {
      const oldestRecent = recentCommunities[recentCommunities.length - 1];

      await this.prisma.recentCommunities.delete({
        where: { id: oldestRecent.id },
      });
    }
  }

  async delete(user_id: string, community_id: string) {
    await this.prisma.recentCommunities.delete({
      where: {
        community_id_user_id: {
          community_id,
          user_id,
        },
      },
    });
  }
}

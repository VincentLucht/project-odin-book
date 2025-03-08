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
    const recentCommunities = await this.prisma.recentCommunities.findMany({
      where: { user_id },
      orderBy: { interacted_at: 'desc' },
      select: {
        id: true,
        interacted_at: true,
        community: { select: { id: true, name: true } },
      },
    });

    if (recentCommunities.length >= 5) {
      const firstRecent = recentCommunities[0];
      const lastRecent = recentCommunities[4];

      if (firstRecent.community.id === community_id) {
        return;
      }

      await this.delete(user_id, lastRecent.community.id);
    }

    let alreadyRecent = false;
    recentCommunities.forEach(({ community }) => {
      if (community.id === community_id) {
        alreadyRecent = true;
      }
    });

    if (!alreadyRecent) {
      await this.prisma.recentCommunities.create({
        data: { user_id, community_id },
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

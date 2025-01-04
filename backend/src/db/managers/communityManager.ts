import { CommunityType, PrismaClient } from '@prisma/client/default';

export default class CommunityManager {
  constructor(private prisma: PrismaClient) {}

  // ! GET
  async foundById(id: string) {
    const count = await this.prisma.community.count({ where: { id } });
    return count > 0;
  }

  async notFoundByName(name: string) {
    const count = await this.prisma.community.count({ where: { name } });
    return count > 0;
  }

  async getByName(name: string) {
    const community = await this.prisma.community.findUnique({
      where: {
        name,
      },
    });

    return community;
  }

  async isPrivate(community_id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id: community_id },
      select: { type: true },
    });

    return community?.type === 'PRIVATE';
  }

  // ! CREATE
  async create(
    name: string,
    is_mature: boolean,
    owner_id: string,
    type: CommunityType,
    community_topics_ids: string[],
    description?: string,
    profile_picture_url_desktop?: string,
    profile_picture_url_mobile?: string,
    banner_url?: string,
  ) {
    console.log(owner_id);

    await this.prisma.community.create({
      data: {
        name,
        is_mature,
        owner_id,
        type,
        // Connect existing topics by ID
        community_topics: {
          create: community_topics_ids.map((topic_id) => ({
            topic: {
              connect: { id: topic_id },
            },
          })),
        },
        description,
        profile_picture_url_desktop,
        profile_picture_url_mobile,
        banner_url,
        community_moderators: {
          create: {
            user: {
              connect: { id: owner_id },
            },
          },
        },
        user_communities: {
          create: {
            id: '23',
            user: {
              connect: {
                id: owner_id,
              },
            },
            role: 'CONTRIBUTOR',
          },
        },
      },
    });
  }
}

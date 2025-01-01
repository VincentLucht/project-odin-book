import { CommunityType, PrismaClient } from '@prisma/client/default';

export default class CommunityManager {
  constructor(private prisma: PrismaClient) {}

  async createCommunity(
    name: string,
    is_private: boolean,
    is_mature: boolean,
    owner_id: string,
    type: CommunityType,
    description?: string,
    profile_picture_url_desktop?: string,
    profile_picture_url_mobile?: string,
    banner_url?: string,
  ) {
    await this.prisma.community.create({
      data: {
        name,
        is_private,
        is_mature,
        owner_id,
        type,
        description,
        profile_picture_url_desktop,
        profile_picture_url_mobile,
        banner_url,
      },
    });
  }
}

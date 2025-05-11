import { PrismaClient } from '@prisma/client/default';

export default class CommunityFlairManager {
  constructor(private prisma: PrismaClient) {}

  // ! GET
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

  async getCommunityFlairCount(community_id: string) {
    const communityFlairCount = await this.prisma.communityFlair.count({
      where: { community_id },
    });

    return communityFlairCount;
  }

  async getPostFlairCount(community_id: string) {
    const postFlairCount = await this.prisma.communityFlair.count({
      where: { community_id, is_assignable_to_posts: true },
    });

    return postFlairCount;
  }

  async fetch(
    community_id: string,
    cursorId: string,
    type: 'post' | 'user',
    take = 50,
  ) {
    const flairs = await this.prisma.communityFlair.findMany({
      where: {
        community_id,
        is_assignable_to_posts: type === 'post' ? true : false,
        is_assignable_to_users: type === 'user' ? true : false,
      },
      ...(cursorId && {
        cursor: { id: cursorId },
        skip: 1,
      }),
      orderBy: { created_at: 'desc' },
      take,
    });

    const hasMore = flairs.length === take;
    const lastPostFlair = flairs[flairs?.length - 1];
    const nextCursor = hasMore ? lastPostFlair?.id : null;

    return {
      flairs,
      pagination: {
        nextCursor,
        hasMore,
      },
    };
  }

  // ! CREATE
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

  // ! UPDATE
  async update(
    community_flair_id: string,
    community_id: string,
    name: string,
    textColor: string,
    color: string,
    is_assignable_to_posts: boolean,
    is_assignable_to_users: boolean,
    emoji?: string,
  ) {
    await this.prisma.communityFlair.update({
      where: {
        id: community_flair_id,
      },
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
  }

  // ! DELETE
  async delete(community_flair_id: string) {
    await this.prisma.communityFlair.delete({
      where: { id: community_flair_id },
    });
  }
}

import { PrismaClient } from '@prisma/client/default';

export default class PostAssignedFlairManager {
  constructor(private prisma: PrismaClient) {}
  // ! GET
  async getById(post_assigned_flair_id: string) {
    const postFlair = await this.prisma.postAssignedFlair.findUnique({
      where: {
        id: post_assigned_flair_id,
      },
    });

    return postFlair;
  }

  async getByIdAndCommunityFlair(post_assigned_flair_id: string) {
    const postFlair = await this.prisma.postAssignedFlair.findUnique({
      where: {
        id: post_assigned_flair_id,
      },
      include: {
        community_flair: true,
      },
    });

    return postFlair;
  }

  async getPostFlairInCommunity(post_id: string, community_id: string) {
    const postFlair = await this.prisma.postAssignedFlair.findFirst({
      where: {
        post_id,
        community_flair: {
          community_id,
        },
      },
    });

    return postFlair;
  }

  // ! POST
  async create(post_id: string, community_flair_id: string) {
    const postFlair = await this.prisma.postAssignedFlair.create({
      data: { post_id, community_flair_id },
      include: { community_flair: true },
    });

    return postFlair;
  }

  // ! PUT
  async update(post_assigned_flair_id: string, community_flair_id: string) {
    const postFlair = await this.prisma.postAssignedFlair.update({
      where: {
        id: post_assigned_flair_id,
      },
      data: {
        community_flair_id,
      },
      include: { community_flair: true },
    });

    return postFlair;
  }

  // ! DELETE
  async delete(post_assigned_flair_id: string) {
    await this.prisma.postAssignedFlair.delete({
      where: { id: post_assigned_flair_id },
    });
  }
}

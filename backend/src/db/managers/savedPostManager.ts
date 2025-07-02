import { PrismaClient } from '@prisma/client/default';
import { getPostInfo } from '@/db/managers/communityManager/util/baseQuery';

export default class SavedPostManager {
  constructor(private prisma: PrismaClient) {}

  async fetch(user_id: string, cursor_id: string | undefined, take = 30) {
    const savedPosts = await this.prisma.savedPost.findMany({
      where: {
        user_id,
      },
      orderBy: [{ saved_at: 'desc' }, { id: 'asc' }],
      include: {
        post: {
          include: {
            community: {
              select: {
                id: true,
                name: true,
                profile_picture_url: true,
                user_communities: {
                  where: { user_id },
                  select: { user_id: true, role: true },
                },
              },
            },
            ...getPostInfo(user_id, true),
          },
        },
      },
      ...(cursor_id && {
        cursor: {
          id: cursor_id,
        },
        skip: 1,
      }),
      take,
    });

    return {
      posts: savedPosts.map((savedPost) => savedPost.post),
      pagination: {
        hasMore: take === savedPosts?.length,
        nextCursor: savedPosts?.[savedPosts?.length - 1]?.id,
      },
    };
  }

  async isSaved(user_id: string, post_id: string) {
    const result = await this.prisma.savedPost.findUnique({
      where: {
        post_id_user_id: {
          post_id,
          user_id,
        },
      },
    });

    return result !== null;
  }

  async save(user_id: string, post_id: string) {
    await this.prisma.savedPost.create({
      data: {
        user_id,
        post_id,
      },
    });
  }

  async unsave(user_id: string, post_id: string) {
    await this.prisma.savedPost.delete({
      where: {
        post_id_user_id: {
          post_id,
          user_id,
        },
      },
    });
  }
}

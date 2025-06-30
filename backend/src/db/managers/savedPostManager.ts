import { PrismaClient } from '@prisma/client/default';

export default class SavedPostManager {
  constructor(private prisma: PrismaClient) {}

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

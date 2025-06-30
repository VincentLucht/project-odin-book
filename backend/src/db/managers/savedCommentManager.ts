import { PrismaClient } from '@prisma/client/default';

export default class SavedCommentManager {
  constructor(private prisma: PrismaClient) {}

  async isSaved(user_id: string, comment_id: string) {
    const result = await this.prisma.savedComment.findUnique({
      where: {
        comment_id_user_id: {
          comment_id,
          user_id,
        },
      },
    });
    return result !== null;
  }

  async save(user_id: string, comment_id: string) {
    await this.prisma.savedComment.create({
      data: {
        user_id,
        comment_id,
      },
    });
  }

  async unsave(user_id: string, comment_id: string) {
    await this.prisma.savedComment.delete({
      where: {
        comment_id_user_id: {
          comment_id,
          user_id,
        },
      },
    });
  }
}

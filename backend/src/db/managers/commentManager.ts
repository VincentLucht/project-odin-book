import { PrismaClient, Comment } from '@prisma/client/default';
import { CommentWithReplies } from '@/db/managers/util/types';

export default class CommentManager {
  constructor(private prisma: PrismaClient) {}
  // ! GET
  async getById(
    id: string,
    hasReply: boolean = false,
  ): Promise<Comment | CommentWithReplies | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: hasReply ? { replies: { take: 1 } } : {},
    });

    return comment;
  }

  // ! POST
  async create(
    content: string,
    post_id: string,
    poster_id: string,
    parent_comment_id: string | undefined,
  ) {
    const comment = await this.prisma.comment.create({
      data: {
        content,
        post_id,
        user_id: poster_id,
        ...(parent_comment_id && { parent_comment_id }),
      },
    });

    return comment;
  }

  // ! DELETE
  async delete(comment_id: string, poster_id: string) {
    await this.prisma.comment.delete({
      where: { id: comment_id, user_id: poster_id },
    });
  }

  async softDelete(comment_id: string, poster_id: string) {
    await this.prisma.comment.update({
      where: { id: comment_id, user_id: poster_id },
      data: {
        is_deleted: true,
        content: '',
        user_id: null,
      },
    });
  }
}

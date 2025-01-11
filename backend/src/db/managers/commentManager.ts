import { PrismaClient } from '@prisma/client/default';

export default class CommentManager {
  constructor(private prisma: PrismaClient) {}
  // ! GET
  async getById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
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
}

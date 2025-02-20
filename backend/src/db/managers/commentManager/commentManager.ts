import { PrismaClient, Comment } from '@prisma/client/default';
import { CommentWithReplies } from '@/db/managers/util/types';
import { get7Replies } from '@/db/managers/commentManager/util/commentUtils';

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

  //* * Fetches comment thread with up to 30 main comments, each with 8 replies */
  async getCommentThreads(post_id: string, user_id: string | undefined) {
    return this.prisma.comment.findMany({
      where: { post_id, parent_comment_id: null },
      include: {
        user: { select: { username: true, profile_picture_url: true } },
        comment_votes: user_id
          ? {
              where: { user_id },
              select: { user_id: true, vote_type: true },
            }
          : {
              select: { user_id: true, vote_type: true },
              where: { user_id: 'someuseridthatwillneverexist1234_2' }, // ? ensure empty arr
            },
        _count: { select: { replies: true } },
        ...get7Replies,
      },
      orderBy: { created_at: 'desc' },
      take: 30,
    });
  }

  async getMoreReplies(
    parent_comment_id: string,
    post_id: string,
    user_id: string | undefined,
    limit: number = 10,
  ) {
    return this.prisma.comment.findMany({
      where: { id: parent_comment_id, post_id },
      include: {
        user: { select: { username: true, profile_picture_url: true } },
        comment_votes: user_id
          ? {
              where: { user_id },
              select: { user_id: true, vote_type: true },
            }
          : {
              select: { user_id: true, vote_type: true },
              where: { user_id: 'someuseridthatwillneverexist1234_2' }, // ? ensure empty arr
            },
        _count: { select: { replies: true } },
        ...get7Replies,
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  // ! POST
  async create(
    content: string,
    post_id: string,
    poster_id: string,
    parent_comment_id: string | undefined,
  ) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            content,
            post_id,
            user_id: poster_id,
            comment_votes: {
              create: {
                user: { connect: { id: poster_id } },
                vote_type: 'UPVOTE',
              },
            },
            total_vote_score: 1,
            ...(parent_comment_id && { parent_comment_id }),
          },
        });

        await tx.post.update({
          where: { id: post_id },
          data: {
            total_comment_score: { increment: 1 },
          },
        });

        return comment;
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }

  // ! UPDATE
  async update(comment_id: string, user_id: string, new_content: string) {
    const updatedComment = await this.prisma.comment.update({
      where: { id: comment_id, user_id },
      data: {
        content: new_content,
        edited_at: new Date().toISOString(),
      },
      include: {
        user: { select: { username: true, profile_picture_url: true } },
        comment_votes: user_id
          ? {
              where: { user_id },
              select: { user_id: true, vote_type: true },
            }
          : {
              select: { user_id: true, vote_type: true },
              where: { user_id: 'someuseridthatwillneverexist1234_2' },
            },
        _count: { select: { replies: true } },
      },
    });

    return updatedComment;
  }

  // ! DELETE
  async delete(comment_id: string, poster_id: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const comment = await tx.comment.delete({
          where: { id: comment_id, user_id: poster_id },
        });

        await tx.post.update({
          where: { id: comment.post_id },
          data: { total_comment_score: { decrement: 1 } },
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
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

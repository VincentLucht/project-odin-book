import { PrismaClient, VoteType } from '@prisma/client/default';

export default class CommentVoteManager {
  constructor(private prisma: PrismaClient) {}

  async getById(comment_id: string, user_id: string) {
    const vote = await this.prisma.commentVote.findUnique({
      where: {
        comment_id_user_id: { comment_id, user_id },
      },
    });

    return vote;
  }

  async create(comment_id: string, user_id: string, vote_type: VoteType) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.commentVote.create({
          data: {
            comment_id,
            user_id,
            vote_type,
          },
        });

        await tx.comment.update({
          where: { id: comment_id },
          data:
            vote_type === 'UPVOTE'
              ? {
                  upvote_count: { increment: 1 },
                  total_vote_score: { increment: 1 },
                }
              : {
                  downvote_count: { increment: 1 },
                  total_vote_score: { decrement: 1 },
                },
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }

  async update(comment_id: string, user_id: string, vote_type: VoteType) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.commentVote.update({
          where: {
            comment_id_user_id: { comment_id, user_id },
          },
          data: {
            vote_type,
          },
        });

        await tx.comment.update({
          where: { id: comment_id },
          data:
            vote_type === 'DOWNVOTE'
              ? {
                  upvote_count: { decrement: 1 },
                  downvote_count: { increment: 1 },
                  total_vote_score: { decrement: 2 },
                }
              : {
                  upvote_count: { increment: 1 },
                  downvote_count: { decrement: 1 },
                  total_vote_score: { increment: 2 },
                },
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }

  async delete(
    comment_id: string,
    user_id: string,
    previous_vote_type: VoteType,
  ) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.commentVote.delete({
          where: {
            comment_id_user_id: { comment_id, user_id },
          },
        });

        await tx.comment.update({
          where: { id: comment_id },
          data:
            previous_vote_type === 'DOWNVOTE'
              ? {
                  downvote_count: { decrement: 1 },
                  total_vote_score: { increment: 1 },
                }
              : {
                  upvote_count: { decrement: 1 },
                  total_vote_score: { decrement: 1 },
                },
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }
}

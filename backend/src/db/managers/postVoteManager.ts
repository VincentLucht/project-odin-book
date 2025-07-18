import { PrismaClient, VoteType } from '@prisma/client/default';

export default class PostVoteManager {
  constructor(private prisma: PrismaClient) {}

  async getById(post_id: string, user_id: string) {
    const vote = await this.prisma.postVote.findUnique({
      where: {
        post_id_user_id: { post_id, user_id },
      },
    });

    return vote;
  }

  async hasVoted(post_id: string, user_id: string) {
    const count = await this.prisma.postVote.count({
      where: {
        post_id,
        user_id,
      },
    });
    return count > 0;
  }

  async vote(post_id: string, user_id: string, vote_type: VoteType) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.postVote.create({
          data: {
            post_id,
            user_id,
            vote_type,
          },
        });

        await tx.post.update({
          where: { id: post_id },
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

        await tx.user.update({
          where: { id: user_id },
          data:
            vote_type === 'UPVOTE'
              ? {
                  post_karma: { increment: 1 },
                }
              : {
                  post_karma: { decrement: 1 },
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

  async update(post_id: string, user_id: string, vote_type: VoteType) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.postVote.update({
          where: {
            post_id_user_id: { post_id, user_id },
          },
          data: {
            vote_type,
          },
        });

        await tx.post.update({
          where: { id: post_id },
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

        await tx.user.update({
          where: { id: user_id },
          data:
            vote_type === 'DOWNVOTE'
              ? {
                  post_karma: { decrement: 2 },
                }
              : {
                  post_karma: { increment: 2 },
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

  async delete(post_id: string, user_id: string, previous_vote_type: VoteType) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.postVote.delete({
          where: {
            post_id_user_id: { post_id, user_id },
          },
        });

        await tx.post.update({
          where: { id: post_id },
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

        await tx.user.update({
          where: { id: user_id },
          data:
            previous_vote_type === 'DOWNVOTE'
              ? {
                  post_karma: { increment: 1 },
                }
              : {
                  post_karma: { decrement: 1 },
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

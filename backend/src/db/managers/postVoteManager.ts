import { PrismaClient, VoteType } from '@prisma/client/default';

export default class PostVoteManager {
  constructor(private prisma: PrismaClient) {}

  async getById(post_id: string, user_id: string) {
    const vote = await this.prisma.postVote.findUnique({
      where: {
        post_id_user_id: {
          post_id,
          user_id,
        },
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

  async create(post_id: string, user_id: string, vote_type: VoteType) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await Promise.all([
          tx.postVote.create({
            data: {
              post_id,
              user_id,
              vote_type,
            },
          }),

          tx.post.update({
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
          }),
        ]);
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
        await Promise.all([
          tx.postVote.update({
            where: {
              post_id_user_id: {
                post_id,
                user_id,
              },
            },
            data: {
              vote_type,
            },
          }),

          tx.post.update({
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
          }),
        ]);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unknown error occurred');
    }
  }
}

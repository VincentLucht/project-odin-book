import { PrismaClient } from '@prisma/client/default';

export default class SavedCommentManager {
  constructor(private prisma: PrismaClient) {}

  async fetch(user_id: string, cursor_id: string | undefined, take = 30) {
    const savedComments = await this.prisma.savedComment.findMany({
      where: {
        user_id,
      },
      orderBy: [{ saved_at: 'desc' }, { id: 'asc' }],
      include: {
        comment: {
          include: {
            post: {
              select: {
                title: true,
                community: {
                  select: {
                    name: true,
                    profile_picture_url: true,
                    type: true,
                  },
                },
              },
            },
            comment_votes: {
              where: { user_id },
              select: { user_id: true, vote_type: true },
            },
            user: {
              select: { username: true },
            },
            saved_by: {
              where: { user_id },
              select: { user_id: true },
            },
            reports: {
              where: { reporter_id: user_id },
            },
            moderation: {
              include: {
                moderator: {
                  select: {
                    user: {
                      select: { username: true, profile_picture_url: true },
                    },
                  },
                },
              },
            },
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
      comments: savedComments.map((savedComment) => savedComment.comment),
      pagination: {
        nextCursor: savedComments?.[savedComments?.length - 1]?.id,
        hasMore: savedComments.length === take,
      },
    };
  }

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

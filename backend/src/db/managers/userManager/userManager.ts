import { PrismaClient } from '@prisma/client/default';
import { SortByUser } from '@/db/managers/util/types';
import {
  sortByNew,
  userSelectFields,
} from '@/db/managers/userManager/util/userUtils';
import { Comment, Post } from '@prisma/client/default';

export default class UserManager {
  constructor(private prisma: PrismaClient) {}

  // ! READ
  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async getByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  }

  async getByUsernameAndHistory(
    user_id: string,
    username: string,
    sortBy: SortByUser,
    page: number,
  ) {
    const limit = 15;
    const offset = (page - 1) * limit;

    const userAndHistory = await this.prisma.user.findUnique({
      where: { username },
      select: {
        ...userSelectFields,
        post: {
          include: {
            post_votes: {
              where: { user_id },
              select: { user_id: true, vote_type: true },
            },
            community: {
              select: {
                id: true,
                name: true,
                profile_picture_url: true,
                user_communities: {
                  where: { user_id },
                  select: { user_id: true },
                },
              },
            },
          },
          take: limit,
          skip: offset,
          orderBy:
            sortBy === 'new'
              ? {
                  created_at: 'desc',
                }
              : {
                  total_vote_score: 'desc',
                },
        },
        comment: {
          include: {
            comment_votes: {
              where: { user_id },
              select: { user_id: true, vote_type: true },
            },
            parent_comment: {
              select: {
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
            post: {
              select: {
                title: true,
                community: {
                  select: {
                    name: true,
                    profile_picture_url: true,
                  },
                },
              },
            },
            user: { select: { username: true } },
          },
          take: limit,
          skip: offset,
          orderBy:
            sortBy === 'new'
              ? {
                  created_at: 'desc',
                }
              : {
                  total_vote_score: 'desc',
                },
        },
      },
    });

    let sortedHistory: Array<Comment | Post> = [];
    if (userAndHistory?.post && userAndHistory?.comment) {
      sortedHistory = sortByNew(
        userAndHistory.post,
        userAndHistory.comment,
        sortBy,
      );
    }

    // Destructure: remove post and comment, add history
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { post, comment, ...userWithoutHistory } = userAndHistory || {};

    return {
      ...userWithoutHistory,
      history: sortedHistory,
    };
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  // ! CREATE
  async create(
    username: string,
    email: string,
    hashedPassword: string,
    display_name?: string,
    profile_picture_url?: string,
    cake_day?: string,
  ) {
    await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        display_name,
        profile_picture_url,
        cake_day,
      },
    });
  }
}

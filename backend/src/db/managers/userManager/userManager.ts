import { PrismaClient } from '@prisma/client/default';
import { SortByUser } from '@/db/managers/util/types';
import {
  sortByNew,
  userSelectFields,
} from '@/db/managers/userManager/util/userUtils';
import bcrypt from 'bcrypt';
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
    user_id: string | undefined,
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
            ...(user_id && {
              post_votes: {
                where: { user_id },
                select: { user_id: true, vote_type: true },
              },
            }),
            reports: true,
            community: {
              select: {
                id: true,
                name: true,
                profile_picture_url: true,
                ...(user_id && {
                  user_communities: {
                    where: { user_id },
                    select: { user_id: true },
                  },
                }),
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
            ...(user_id && {
              comment_votes: {
                where: { user_id },
                select: { user_id: true, vote_type: true },
              },
            }),
            parent_comment: {
              select: {
                user: {
                  select: {
                    username: true,
                  },
                },
              },
            },
            reports: true,
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

  async getSettings(user_id: string, check_existence = false) {
    const userWithPassword = await this.prisma.user.findUnique({
      where: { id: user_id },
      include: { user_settings: true },
    });
    const userSettings = await this.prisma.userSettings.findUnique({
      where: { user_id },
    });

    if (!userWithPassword) {
      if (check_existence) {
        throw new Error('User not found');
      }
      return null;
    }

    const userWithoutPassword = {
      ...userWithPassword,
      password: null,
    };
    return {
      user: userWithoutPassword,
      userSettings,
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
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        display_name,
        profile_picture_url,
        cake_day,
      },
    });

    await this.prisma.userSettings.create({
      data: { user_id: user.id },
    });
  }

  // ! UPDATE
  async edit(
    user_id: string,
    updateData: Partial<{
      email: string;
      password: string;
      display_name: string | null;
      description: string | null;
      profile_picture_url: string | null;
      cake_day: string | null;
    }>,
    settingsData?: Partial<{
      community_enabled: boolean;
      posts_enabled: boolean;
      comments_enabled: boolean;
      mods_enabled: boolean;
      chats_enabled: boolean;
      follows_enabled: boolean;
    }>,
  ) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.prisma.user.update({
      where: { id: user_id },
      data: updateData,
    });

    if (settingsData) {
      await this.prisma.userSettings.update({
        where: { user_id },
        data: settingsData,
      });
    }
  }

  // ! DELETE
  async delete(user_id: string) {
    await this.prisma.communityModerator.deleteMany({ where: { user_id } });

    await this.prisma.recentCommunities.deleteMany({ where: { user_id } });

    await this.prisma.user.update({
      where: { id: user_id },
      data: {
        deleted_at: new Date(),
        username: `deleted_${user_id.substring(0, 8)}`,
        email: `deleted_${user_id}@deleted.com`,
        password: '',
        display_name: null,
        profile_picture_url: null,
        description: null,
        cake_day: null,
      },
    });
  }
}

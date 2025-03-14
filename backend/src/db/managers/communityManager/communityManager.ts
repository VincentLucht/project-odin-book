import getStartDate from '@/db/managers/util/getStartDate';
import calculateHotScore from '@/util/calculateHotScore';
import baseQuery from '@/db/managers/communityManager/util/baseQuery';

import { TimeFrame } from '@/db/managers/util/types';
import { CommunityType, PrismaClient } from '@prisma/client/default';

export default class CommunityManager {
  constructor(private prisma: PrismaClient) {}

  // ! GET
  async doesExistById(id: string) {
    const count = await this.prisma.community.count({ where: { id } });
    return count > 0;
  }

  async doesExistByName(name: string) {
    const count = await this.prisma.community.count({ where: { name } });
    return count > 0;
  }

  async getById(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
    });

    return community;
  }

  async getByName(name: string) {
    const community = await this.prisma.community.findUnique({
      where: { name },
    });

    return community;
  }

  async searchByName(argName: string) {
    let name = argName;
    if (name.includes('r/')) {
      name = name.replace('r/', '');
    }

    const communities = await this.prisma.community.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        profile_picture_url: true,
        total_members: true,
      },
      take: 15,
    });

    return communities;
  }

  async getCreationInfo(name: string, user_id?: string) {
    const community = await this.prisma.community.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        profile_picture_url: true,
        type: true,
        allow_basic_user_posts: true,
        is_post_flair_required: true,
        user_communities: user_id
          ? {
              where: {
                user_id,
              },
              select: {
                id: true,
                role: true,
                user_id: true,
              },
            }
          : false,
        // rules
        // community flairs??
      },
    });

    return community;
  }

  async fetchByNew(
    name: string,
    requestUserId: string | undefined,
    cursorId: string | undefined,
  ) {
    const limit = 30;

    const query = baseQuery(name, requestUserId, {
      sort: 'new',
      limit,
      ...(cursorId && { cursor: cursorId }),
    });
    const community = await this.prisma.community.findUnique(query);

    const lastPost = community?.posts[community.posts.length - 1];
    const nextCursor = lastPost?.id;

    return {
      community,
      // Assume there are more posts
      pagination: { nextCursor, hasMore: community?.posts.length === limit },
    };
  }

  async fetchByTop(
    name: string,
    timeframe: TimeFrame,
    requestUserId: string | undefined,
    cursorId: string,
  ) {
    const limit = 10;
    const startDate = getStartDate(timeframe);

    const query = baseQuery(name, requestUserId, {
      sort: 'top',
      ...(cursorId && { cursor: cursorId }),
      ...(startDate && { timeFilter: startDate }),
    });
    const community = await this.prisma.community.findUnique(query);

    const lastPost = community?.posts[community.posts.length - 1];
    const nextCursor = lastPost?.id;

    return {
      community,
      pagination: { nextCursor, hasMore: community?.posts.length === limit },
    };
  }

  async fetchByHot(name: string, requestUserId: string | undefined) {
    const currentDate = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(currentDate.getDate() - 3);

    const query = baseQuery(name, requestUserId, {
      sort: 'hot',
      timeFilter: threeDaysAgo,
    });

    // hot means: number of upvotes/downvotes and comments
    const community = await this.prisma.community.findUnique({
      where: { name },
      include: {
        ...(requestUserId && {
          user_communities: {
            where: { user_id: requestUserId },
            select: { user_id: true, role: true },
          },
        }),
        posts: {
          include: {
            ...(requestUserId && {
              post_votes: {
                where: { user_id: requestUserId },
                select: { user_id: true, vote_type: true },
              },
            }),
            poster: {
              select: {
                id: true,
                username: true,
                profile_picture_url: true,
              },
            },
            community: {
              select: {
                id: true,
                name: true,
                profile_picture_url: true,
                ...(requestUserId && {
                  user_communities: {
                    where: { user_id: requestUserId },
                    select: { user_id: true },
                  },
                }),
              },
            },
            // TODO: ADD this to all
            post_assigned_flair: {
              select: {
                id: true,
                community_flair: true,
              },
            },
          },
          where: {
            deleted_at: null,
          },
        },
      },
    });

    const postsWithHotScore = community?.posts.map((post) => {
      return {
        ...post,
        hotScore: calculateHotScore(
          post.upvote_count,
          post.downvote_count,
          post.created_at,
        ),
      };
    });

    const sortedByHotPosts = postsWithHotScore?.sort(
      (a, b) => b.hotScore - a.hotScore,
    );

    if (community && sortedByHotPosts) {
      community.posts = sortedByHotPosts;
    }

    return { community };
  }

  async isPrivate(community_id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id: community_id },
      select: { type: true },
    });

    return community?.type === 'PRIVATE';
  }

  // ! CREATE
  async create(
    name: string,
    description: string,
    is_mature: boolean,
    allow_basic_user_posts: boolean,
    is_post_flair_required: boolean,
    owner_id: string,
    type: CommunityType,
    community_topics_ids: string[],
    banner_url_desktop?: string,
    banner_url_mobile?: string,
    profile_picture_url?: string,
  ) {
    await this.prisma.community.create({
      data: {
        name,
        is_mature,
        allow_basic_user_posts,
        is_post_flair_required,
        owner_id,
        type,
        // Connect existing topics by ID
        community_topics: {
          create: community_topics_ids.map((topic_id) => ({
            topic: {
              connect: { id: topic_id },
            },
          })),
        },
        description,
        profile_picture_url,
        banner_url_desktop,
        banner_url_mobile,
        community_moderators: {
          create: {
            user: {
              connect: { id: owner_id },
            },
          },
        },
        user_communities: {
          create: {
            user: {
              connect: {
                id: owner_id,
              },
            },
            role: 'CONTRIBUTOR',
          },
        },
      },
    });
  }
}

import getStartDate from '@/db/managers/util/getStartDate';
import calculateHotScore from '@/util/calculateHotScore';
import baseQuery from '@/db/managers/communityManager/util/baseQuery';
import { getCommunityInfo } from '@/db/managers/communityManager/util/baseQuery';

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
        community_rules: true,
      },
    });

    return community;
  }

  async getModInfo(name: string, requestUserId: string) {
    const community = await this.prisma.community.findUnique({
      where: { name },
      include: {
        owner: {
          select: {
            deleted_at: true,
            display_name: true,
            id: true,
            is_mature: true,
            profile_picture_url: true,
            username: true,
            description: true,
          },
        },
        community_moderators: {
          where: { user_id: requestUserId },
          select: {
            is_active: true,
            user: {
              select: { id: true, username: true, profile_picture_url: true },
            },
          },
        },
      },
    });

    return community;
  }

  async fetch(
    communityName: string,
    communityId: string,
    requestUserId: string | undefined,
  ) {
    const community = await this.prisma.community.findUnique(
      getCommunityInfo(communityName, communityId, requestUserId, true),
    );

    return community;
  }

  async fetchByNew(
    name: string,
    communityId: string,
    requestUserId: string | undefined,
    cursorId: string | undefined,
  ) {
    const limit = 30;

    const query = baseQuery(name, requestUserId, communityId, {
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
    communityId: string,
    timeframe: TimeFrame,
    requestUserId: string | undefined,
    cursorId: string,
  ) {
    const limit = 30;
    const startDate = getStartDate(timeframe);

    const query = baseQuery(name, requestUserId, communityId, {
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

  async fetchByHot(
    name: string,
    communityId: string,
    requestUserId: string | undefined,
  ) {
    const currentDate = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(currentDate.getDate() - 3);

    const query = baseQuery(name, requestUserId, communityId, {
      sort: 'hot',
      timeFilter: threeDaysAgo,
    });

    const community = await this.prisma.community.findUnique(query);

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

  // ! UPDATE
  async editCommunitySettings(
    community_name: string,
    apiData: Partial<{
      description: string;
      type: CommunityType;
      is_mature: boolean;
      allow_basic_user_posts: boolean;
      is_post_flair_required: boolean;
      profile_picture_url?: string;
      banner_url_desktop?: string;
      banner_url_mobile?: string;
    }>,
    previousAllowBasicUserPosts: boolean,
  ) {
    await this.prisma.community.update({
      where: { name: community_name },
      data: {
        ...apiData,
        ...(apiData?.type && {
          allow_basic_user_posts:
            apiData?.type === 'PUBLIC' ? true : previousAllowBasicUserPosts,
        }),
      },
    });
  }
}

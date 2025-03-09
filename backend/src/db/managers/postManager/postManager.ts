import { PostType, PrismaClient } from '@prisma/client/default';
import { postSelectFields } from '@/db/managers/postManager/util/postUtils';

export default class PostManager {
  constructor(private prisma: PrismaClient) {}
  // ! GET
  async getById(post_id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: post_id },
    });

    return post;
  }

  async getByIdAndCommunity(post_id: string, user_id: string | undefined) {
    const postAndCommunity = await this.prisma.post.findUnique({
      where: { id: post_id },
      select: {
        ...postSelectFields,
        poster: {
          select: { username: true },
        },
        ...(user_id && {
          post_votes: {
            where: { user_id },
            select: { user_id: true, vote_type: true },
          },
        }),
        post_assigned_flair: {
          include: {
            community_flair: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            description: true,
            profile_picture_url: true,
            // no banners
            created_at: true,
            type: true,
            is_mature: true,
            // no is_post_flair_required
            // no allow_basic_user_posts
            // no owner
            user_communities: {
              where: { user_id },
              select: { user_id: true },
            },
          },
        },
      },
    });

    return postAndCommunity;
  }

  // ! POST
  async create(
    community_id: string,
    poster_id: string,
    title: string,
    body: string,
    is_spoiler: boolean,
    is_mature: boolean,
    post_type: PostType,
    flair_id: string | undefined,
  ) {
    const post = await this.prisma.post.create({
      data: {
        community_id,
        poster_id,
        title,
        body,
        is_spoiler,
        is_mature,
        post_type,
        ...(flair_id && {
          post_assigned_flair: {
            create: {
              community_flair_id: flair_id,
            },
          },
        }),
      },
    });

    return post;
  }

  // ! PUT
  async edit(
    post_id: string,
    body: string,
    is_spoiler: boolean,
    is_mature: boolean,
    flair_id: string | undefined,
    hadPreviousFlair: boolean,
  ) {
    await this.prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        body,
        is_spoiler,
        edited_at: new Date().toISOString(),
        is_mature,
        ...(flair_id && {
          post_assigned_flair: hadPreviousFlair
            ? {
                update: {
                  where: {
                    post_id_community_flair_id: {
                      post_id,
                      community_flair_id: flair_id,
                    },
                  },
                  data: {
                    community_flair_id: flair_id,
                  },
                },
              }
            : {
                create: {
                  community_flair_id: flair_id,
                },
              },
        }),
      },
    });
  }

  // ! DELETE
  async deletePost(post_id: string) {
    await this.prisma.post.update({
      where: { id: post_id },
      data: {
        deleted_at: new Date().toISOString(),
        poster_id: null,
        body: '',
        pinned_at: null,
      },
    });
  }
}

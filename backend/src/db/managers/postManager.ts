import { PostType, PrismaClient } from '@prisma/client/default';

export default class PostManager {
  constructor(private prisma: PrismaClient) {}
  // ! GET
  async getById(post_id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: post_id },
    });

    return post;
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
    title: string,
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
        title,
        body,
        is_spoiler,
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
}

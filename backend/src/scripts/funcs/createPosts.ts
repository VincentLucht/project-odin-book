import { PrismaClient } from '@prisma/client/default';

export default async function createPosts(prisma: PrismaClient) {
  await Promise.all([
    prisma.post.create({
      data: {
        id: '1',
        community_id: '1',
        poster_id: '1',
        title: 'Test Post',
        body: 'Hiii! This is a test post! Really good right?',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
        total_comment_score: 10,
      },
    }),

    prisma.post.create({
      data: {
        id: '2',
        community_id: '1',
        poster_id: '1',
        title: 'Test SPOILER Post',
        body: 'Hiii! This is a SPOILER post! OMG wow I spoiled everything?',
        is_spoiler: true,
        is_mature: true,
        post_type: 'BASIC',
      },
    }),
  ]);
}

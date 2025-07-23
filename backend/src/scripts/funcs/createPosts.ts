import { PrismaClient } from '@prisma/client/default';
import { faker } from '@faker-js/faker';

export default async function createPosts(prisma: PrismaClient) {
  const latestCreatedAt = new Date();
  latestCreatedAt.setHours(latestCreatedAt.getHours() - 10);

  // Posts for populating search results
  for (let i = 0; i < 300; i++) {
    const isMature = Math.random() < 0.1;
    const isSpoiler = Math.random() < 0.1;

    // Increment by 1 min for each iteration
    latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

    const randomNumber = Math.random();

    await prisma.post.create({
      data: {
        id: `${i + 5}`,
        community_id: '1',
        poster_id: '1',
        title: `test ${i + 1}`,
        body: `${faker.lorem.paragraph({ min: 7, max: 25 })}`,
        is_mature: isMature,
        is_spoiler: isSpoiler,
        post_type: 'BASIC',
        total_vote_score: i * randomNumber,
        upvote_count: i * randomNumber,
        created_at: new Date(latestCreatedAt),
        times_reported: i,
      },
    });
  }

  latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

  // Filler posts for comments
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
        total_comment_score: 3284,
        total_vote_score: 10783,
        created_at: new Date(latestCreatedAt),
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
        total_comment_score: 50,
        total_vote_score: 0,
        created_at: new Date(latestCreatedAt),
      },
    }),
  ]);
}

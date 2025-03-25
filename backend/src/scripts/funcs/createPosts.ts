import { PrismaClient } from '@prisma/client/default';
import { faker } from '@faker-js/faker';

export default async function createPosts(prisma: PrismaClient) {
  // Posts for populating search results
  for (let i = 0; i < 300; i++) {
    const isMature = Math.random() < 0.1;
    const isSpoiler = Math.random() < 0.1;

    // Increment by 1 min for each iteration
    const createdAt = new Date();
    createdAt.setMinutes(createdAt.getMinutes() + i);

    await prisma.post.create({
      data: {
        community_id: '1',
        poster_id: '1',
        title: `test ${i + 1}`,
        body: `${faker.lorem.paragraph({ min: 7, max: 25 })}`,
        is_mature: isMature,
        is_spoiler: isSpoiler,
        post_type: 'BASIC',
        total_vote_score: i,
        created_at: createdAt,
      },
    });
  }

  // Filler posts
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
    prisma.post.create({
      data: {
        id: '10',
        community_id: '1',
        poster_id: '2',
        title: 'Lorem Ipsum Guide',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis nec urna tincidunt tincidunt.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '11',
        community_id: '1',
        poster_id: '3',
        title: 'Vestibulum Ante Ipsum',
        body: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec pharetra, magna vestibulum aliquet ultrices.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '12',
        community_id: '1',
        poster_id: '1',
        title: 'Etiam Ultricies Discussion',
        body: 'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '13',
        community_id: '1',
        poster_id: '2',
        title: 'Maecenas Tempus Question',
        body: 'Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '14',
        community_id: '1',
        poster_id: '3',
        title: 'Nullam Quis Announcement',
        body: 'Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '15',
        community_id: '1',
        poster_id: '1',
        title: 'Aenean Vulputate Eleifend',
        body: 'Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '16',
        community_id: '1',
        poster_id: '2',
        title: 'Phasellus Viverra Nulla',
        body: 'Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '17',
        community_id: '1',
        poster_id: '3',
        title: 'Donec Sodales Sagittis',
        body: 'Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '18',
        community_id: '1',
        poster_id: '1',
        title: 'Fusce Vulputate Post',
        body: 'Fusce vulputate eleifend sapien. Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
    prisma.post.create({
      data: {
        id: '19',
        community_id: '1',
        poster_id: '2',
        title: 'Cras Ultricies Thread',
        body: 'Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.',
        is_spoiler: false,
        is_mature: false,
        post_type: 'BASIC',
      },
    }),
  ]);
}

import { PrismaClient } from '@prisma/client/default';

export default async function createComments(prisma: PrismaClient) {
  // Comments for populating search results
  for (let i = 0; i < 300; i++) {
    // Generate random number of minutes within last month
    const randomMinutesAgo = Math.floor(Math.random() * 43200); // 43200 minutes = 30 days

    const createdAt = new Date();
    createdAt.setMinutes(createdAt.getMinutes() - randomMinutesAgo);

    await prisma.comment.create({
      data: {
        id: `${i + 32}`,
        content: `test ${i + 1}`,
        created_at: createdAt,
        post_id: '1',
        user_id: '1',
        total_vote_score: i === 299 ? 10325 : i,
        times_reported: i,
      },
    });
  }

  // Comments for nested comment structure
  await prisma.comment.create({
    data: {
      id: '1',
      content: 'Depth 0',
      post_id: '1',
      user_id: '1',
    },
  });

  await prisma.comment.create({
    data: {
      id: '2',
      content: 'Depth 1',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '1',
    },
  });

  await prisma.comment.create({
    data: {
      id: '3',
      content: 'Depth 2!',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '2',
    },
  });

  await prisma.comment.create({
    data: {
      id: '4',
      content: 'Depth 3',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '3',
    },
  });

  await prisma.comment.create({
    data: {
      id: '5',
      content: 'Depth 4',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '4',
    },
  });

  await prisma.comment.create({
    data: {
      id: '20',
      content: 'Depth 4.4',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '4',
    },
  });

  await prisma.comment.create({
    data: {
      id: '21',
      content: 'Depth 4.5',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '20',
    },
  });

  await prisma.comment.create({
    data: {
      id: '22',
      content: 'Depth 4.6',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '21',
    },
  });

  await prisma.comment.create({
    data: {
      id: '23',
      content: 'Depth 4.7',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '22',
    },
  });

  await prisma.comment.create({
    data: {
      id: '24',
      content: 'Depth 4.8',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '23',
    },
  });

  await prisma.comment.create({
    data: {
      id: '25',
      content: 'Depth 4.9',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '24',
    },
  });

  await prisma.comment.create({
    data: {
      id: '26',
      content: 'Depth 5',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '25',
    },
  });

  await prisma.comment.create({
    data: {
      id: '11',
      content: 'Depth 4.1',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '5',
    },
  });

  await prisma.comment.create({
    data: {
      id: '6',
      content: 'Depth 5',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '5',
    },
  });

  await prisma.comment.create({
    data: {
      id: '7',
      content: 'Depth 6',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '6',
    },
  });

  await prisma.comment.create({
    data: {
      id: '8',
      content: 'Depth 7',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '7',
    },
  });

  await prisma.comment.create({
    data: {
      id: '9',
      content: 'Depth 8',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '8',
    },
  });

  await prisma.comment.create({
    data: {
      id: '10',
      content: 'Depth 9',
      post_id: '1',
      user_id: '1',
      parent_comment_id: '9',
    },
  });

  // Create nested comments to depth 50
  await prisma.comment.create({
    data: {
      id: '1000',
      content: 'Depth 0',
      post_id: '2',
      user_id: '1',
      parent_comment_id: null,
    },
  });
  let currentId = 1000;
  let nextAvailableId = 1001;

  for (let depth = 1; depth <= 50; depth++) {
    await prisma.comment.create({
      data: {
        id: `${nextAvailableId}`,
        content: `Depth ${depth}`,
        post_id: '2',
        user_id: '1',
        parent_comment_id: `${currentId}`,
      },
    });
    currentId = nextAvailableId;
    nextAvailableId++;
  }

  console.log('Successfully created Comments');
}

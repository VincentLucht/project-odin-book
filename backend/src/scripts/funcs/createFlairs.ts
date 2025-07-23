import { PrismaClient } from '@prisma/client/default';

export default async function createFlairs(prisma: PrismaClient) {
  const latestCreatedAt = new Date();
  latestCreatedAt.setHours(latestCreatedAt.getHours() - 20);

  // Create basic flairs with incrementing timestamps
  await prisma.communityFlair.create({
    data: {
      id: '1',
      community_id: '1',
      name: 'Test Post Flair',
      textColor: '#252525',
      color: '#58eb34',
      emoji: '🧪',
      is_assignable_to_posts: true,
      created_at: new Date(latestCreatedAt),
    },
  });

  latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

  await prisma.communityFlair.create({
    data: {
      id: '2',
      community_id: '1',
      name: 'Test Post Flair 2',
      textColor: '#ffffff',
      color: '#123456',
      is_assignable_to_posts: true,
      created_at: new Date(latestCreatedAt),
    },
  });

  // Create user flairs with timestamps
  for (let i = 3; i < 300; i++) {
    latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);
    await prisma.communityFlair.create({
      data: {
        id: i.toString(),
        community_id: '1',
        textColor: '#ffffff',
        name: `Test User Flair ${i}`,
        color: '#654321',
        is_assignable_to_users: true,
        created_at: new Date(latestCreatedAt),
      },
    });
  }

  // Create post flairs with timestamps
  for (let i = 301; i <= 701; i++) {
    latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);
    await prisma.communityFlair.create({
      data: {
        id: i.toString(),
        community_id: '1',
        textColor: '#ffffff',
        name: `Test Post Flair ${i}`,
        color: '#654321',
        is_assignable_to_posts: true,
        created_at: new Date(latestCreatedAt),
      },
    });
  }

  // Assign user flairs
  await prisma.userAssignedFlair.create({
    data: {
      user_id: '1',
      community_flair_id: '3',
    },
  });

  // Add post flair to post
  await prisma.postAssignedFlair.create({
    data: {
      id: '1',
      community_flair_id: '1',
      post_id: '1',
    },
  });

  console.log('Successfully created Post and User Flairs with timestamps');
}

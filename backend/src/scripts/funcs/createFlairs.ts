import { PrismaClient } from '@prisma/client/default';

export default async function createFlairs(prisma: PrismaClient) {
  await prisma.communityFlair.create({
    data: {
      id: '1',
      community_id: '1',
      name: 'Test Post Flair',
      textColor: '#252525',
      color: '#58eb34',
      emoji: '🧪',
      is_assignable_to_posts: true,
    },
  });

  await prisma.communityFlair.create({
    data: {
      id: '2',
      community_id: '1',
      name: 'Test Post Flair 2',
      textColor: '#ffffff',
      color: '#123456',
      is_assignable_to_posts: true,
    },
  });

  // Create user flairs
  for (let i = 3; i < 100; i++) {
    await prisma.communityFlair.create({
      data: {
        id: i.toString(),
        community_id: '1',
        textColor: '#ffffff',
        name: `Test User Flair ${i}`,
        color: '#654321',
        is_assignable_to_users: true,
      },
    });
  }

  // Create post flairs
  for (let i = 100; i <= 200; i++) {
    await prisma.communityFlair.create({
      data: {
        id: i.toString(),
        community_id: '1',
        textColor: '#ffffff',
        name: `Test Post Flair ${i}`,
        color: '#654321',
        is_assignable_to_users: true,
      },
    });
  }

  // Add post flair to post
  await prisma.postAssignedFlair.create({
    data: {
      id: '1',
      community_flair_id: '1',
      post_id: '1',
    },
  });

  console.log('Successfully created Post and User Flairs');
}

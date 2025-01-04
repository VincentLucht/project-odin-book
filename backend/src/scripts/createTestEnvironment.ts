import { PrismaClient, CommunityType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export default async function createTestEnvironment(prisma: PrismaClient) {
  console.log('Creating users...');

  const t1 = await prisma.user.create({
    data: {
      id: '1',
      username: 't1',
      email: 't1',
      password: await bcrypt.hash('1', 10),
      display_name: 't1_display',
      profile_picture_url: 'https://images3.alphacoders.com/999/999707.png',
      description: "I'm a test user",
      cake_day: '21/2',
      created_at: new Date('2022-06-01T00:00:00Z'), // 06/2022
    },
  });

  console.log('Successfully created users');

  console.log('Creating communities...');

  const totalRecords = 2;
  await prisma.$transaction(async (tx) => {
    for (let index = 0; index < totalRecords; index++) {
      const community = await tx.community.create({
        data: {
          id: index.toString(),
          name: `${faker.company.name().substring(0, 10)}_${index}`,
          description: faker.lorem.sentence(),
          type: index === 1 ? CommunityType.PRIVATE : CommunityType.PUBLIC,
          owner_id: t1.id,
        },
      });

      await tx.communityTopics.createMany({
        data: ['1', '2'].map((topicId) => ({
          community_id: community.id,
          topic_id: topicId,
        })),
      });

      await tx.communityModerator.create({
        data: {
          community_id: community.id,
          user_id: t1.id,
        },
      });

      await tx.userCommunity.create({
        data: {
          id: `user_community_${index}`,
          community_id: community.id,
          user_id: t1.id,
          role: 'CONTRIBUTOR',
        },
      });
    }
  });

  console.log('Communities created');
}

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
  const batch = Array.from({ length: totalRecords }, (_, index) => ({
    id: index.toString(),
    name: `${faker.company.name().substring(0, 10)}_${index}`,
    description: faker.lorem.sentence(),
    type: index === 1 ? CommunityType.PRIVATE : CommunityType.PUBLIC,
    owner_id: t1.id,
  }));
  await prisma.community.createMany({ data: batch });

  console.log('Communities created');
}

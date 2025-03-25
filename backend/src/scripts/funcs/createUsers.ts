import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client/default';

export default async function createUsers(prisma: PrismaClient) {
  // Users for populating search results
  for (let i = 0; i < 300; i++) {
    const isMature = Math.random() < 0.1;

    // Increment by 1 min for each iteration
    const createdAt = new Date();
    createdAt.setMinutes(createdAt.getMinutes() + i);

    await prisma.user.create({
      data: {
        username: `test ${i + 1}`,
        email: `email ${i}`,
        password: 'i',
        is_mature: isMature ? true : false,
      },
    });
  }

  await prisma.user.create({
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

  await prisma.user.create({
    data: {
      id: '2',
      username: 't2',
      email: 't2',
      password: await bcrypt.hash('1', 10),
      display_name: 't2_display',
      profile_picture_url: 'https://images3.alphacoders.com/999/999707.png',
      description: "I'm the second test user",
      cake_day: '23/7',
      created_at: new Date('2022-06-01T00:00:00Z'), // 06/2022
    },
  });

  await prisma.user.create({
    data: {
      id: '3',
      username: 'guest',
      email: 'guest',
      password: await bcrypt.hash('pass123', 10),
      display_name: 'Guest User',
      description: "Hi, I'm the guest user!",
      cake_day: '1/1',
    },
  });

  await prisma.user.create({
    data: {
      id: '4',
      username: 'guest_admin',
      email: 'guest_admin',
      password: await bcrypt.hash('adminpw', 10),
      display_name: 'Guest Admin User',
      description: "Hi, I'm the guest admin user!",
      cake_day: '1/1',
    },
  });

  console.log('Successfully created Users');
}

import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client/default';

export default async function createUsers(prisma: PrismaClient) {
  // Users for populating search results
  for (let i = 0; i < 300; i++) {
    const isMature = Math.random() < 0.1;

    // Increment by 1 min for each iteration
    const createdAt = new Date();
    createdAt.setMinutes(createdAt.getMinutes() + i);

    const user = await prisma.user.create({
      data: {
        username: `test ${i + 1}`,
        email: `email${i}@gmail.com`,
        password: `${i + 1}`,
        is_mature: isMature ? true : false,
        created_at: createdAt,
      },
    });
    await prisma.userSettings.create({
      data: {
        user_id: user.id,
      },
    });
  }

  // Create user 1
  const user1 = await prisma.user.create({
    data: {
      id: '1',
      username: 't1',
      email: 't1@gmail.com',
      password: await bcrypt.hash('1', 10),
      display_name: 't1_display',
      profile_picture_url: 'https://images3.alphacoders.com/999/999707.png',
      description: "I'm a test user",
      created_at: new Date('2022-06-01T00:00:00Z'), // 06/2022
    },
  });
  await prisma.userSettings.create({
    data: {
      user_id: user1.id,
    },
  });

  // Create user 2
  const user2 = await prisma.user.create({
    data: {
      id: '2',
      username: 't2',
      email: 't2@gmail.com',
      password: await bcrypt.hash('1', 10),
      display_name: 't2_display',
      profile_picture_url: 'https://i.imgflip.com/47ouuh.jpg?a484128',
      description: "I'm the second test user",
      created_at: new Date('2022-06-01T00:00:00Z'), // 06/2022
    },
  });
  await prisma.userSettings.create({
    data: {
      user_id: user2.id,
    },
  });

  // Create user 3
  const user3 = await prisma.user.create({
    data: {
      id: '5',
      username: 't3',
      email: 't3@gmail.com',
      password: await bcrypt.hash('1', 10),
      display_name: 't3_display',
      profile_picture_url:
        'https://upload.wikimedia.org/wikipedia/ms/7/7e/Saber_FSN.JPG',
      description: "I'm the second test user",
      created_at: new Date('2022-06-01T00:00:00Z'), // 06/2022
    },
  });
  await prisma.userSettings.create({
    data: {
      user_id: user3.id,
    },
  });

  // Create guest user
  const guestUser = await prisma.user.create({
    data: {
      id: '3',
      username: 'guest',
      email: 'guest@gmail.com',
      password: await bcrypt.hash('pass123', 10),
      display_name: 'Guest User',
      description: "Hi, I'm the guest user!",
      cake_day: '1/1',
    },
  });
  await prisma.userSettings.create({
    data: {
      user_id: guestUser.id,
    },
  });

  // Create guest admin user
  const guestAdmin = await prisma.user.create({
    data: {
      id: '4',
      username: 'guest_admin',
      email: 'guest_admin@gmail.com',
      password: await bcrypt.hash('adminpw', 10),
      display_name: 'Guest Admin User',
      description: "Hi, I'm the guest admin user!",
      cake_day: '1/1',
    },
  });
  await prisma.userSettings.create({
    data: {
      user_id: guestAdmin.id,
    },
  });

  console.log('Successfully created Users and their Settings');
}

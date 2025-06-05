import { PrismaClient } from '@prisma/client/default';

export default async function createChatsAndMessages(prisma: PrismaClient) {
  await prisma.chat.create({
    data: {
      id: '1',
      name: 'one-on-one',
      owner_id: '2',
      userChats: {
        create: [
          {
            user: {
              connect: {
                id: '2',
              },
            },
          },
          {
            user: {
              connect: {
                id: '1',
              },
            },
          },
        ],
      },
    },
  });

  await prisma.chatTracker.create({
    data: {
      chat_id: '1',
      owner_id: '1',
      user1_id: '1',
      user2_id: '2',
    },
  });

  const now = new Date();
  const messages: Array<{
    content: string;
    user_id: string;
    chat_id: string;
    time_created: Date;
    iv: string;
  }> = [];
  let messageCount = 1;

  const addMessages = (
    count: number,
    startDate: Date,
    endDate: Date,
    label: string,
  ) => {
    const timeSpan = endDate.getTime() - startDate.getTime();

    for (let i = 0; i < count; i++) {
      const randomOffset = Math.random() * timeSpan;
      const timestamp = new Date(startDate.getTime() + randomOffset);

      messages.push({
        content: `${label} message ${messageCount}`,
        user_id: Math.random() > 0.5 ? '1' : '2', // Alternate between users randomly
        chat_id: '1',
        time_created: timestamp,
        iv: crypto.randomUUID(),
      });
      messageCount++;
    }
  };

  // Today (10 messages)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  addMessages(10, startOfToday, now, 'Today');

  // Yesterday (10 messages)
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );
  const endOfYesterday = new Date(startOfToday.getTime() - 1);
  addMessages(10, startOfYesterday, endOfYesterday, 'Yesterday');

  // Day before yesterday (10 messages)
  const startOfDayBefore = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 2,
  );
  const endOfDayBefore = new Date(startOfYesterday.getTime() - 1);
  addMessages(10, startOfDayBefore, endOfDayBefore, 'Day before');

  // Last week (20 messages) - 3-7 days ago
  const weekAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7,
  );
  addMessages(20, weekAgo, startOfDayBefore, 'Last week');

  // Last month (30 messages) - 1-4 weeks ago
  const monthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );
  addMessages(30, monthAgo, weekAgo, 'Last month');

  // 2-3 months ago (40 messages)
  const threeMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 3,
    now.getDate(),
  );
  addMessages(40, threeMonthsAgo, monthAgo, '2-3 months ago');

  // 4-6 months ago (50 messages)
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 6,
    now.getDate(),
  );
  addMessages(50, sixMonthsAgo, threeMonthsAgo, '4-6 months ago');

  // 6-12 months ago (60 messages)
  const yearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate(),
  );
  addMessages(60, yearAgo, sixMonthsAgo, '6-12 months ago');

  // 1-2 years ago (70 messages)
  const twoYearsAgo = new Date(
    now.getFullYear() - 2,
    now.getMonth(),
    now.getDate(),
  );
  addMessages(70, twoYearsAgo, yearAgo, '1-2 years ago');

  // Sort messages by timestamp (oldest first)
  messages.sort((a, b) => a.time_created.getTime() - b.time_created.getTime());

  await prisma.message.createMany({
    data: messages,
  });

  await prisma.message.create({
    data: {
      id: 'latest message',
      chat_id: '1',
      content: 'Latest message!',
      time_created: new Date(),
      user_id: '1',
      iv: '',
    },
  });

  await prisma.chat.update({
    where: { id: '1' },
    data: {
      last_message_id: 'latest message',
    },
  });

  console.log('Successfully created chat with messages');
}

import { PrismaClient } from '@prisma/client/default';

export default async function createModmails(prisma: PrismaClient) {
  const latestCreatedAt = new Date();
  latestCreatedAt.setHours(latestCreatedAt.getHours() - 20);

  // Create basic modmail entries with incrementing timestamps
  await prisma.modMail.create({
    data: {
      id: '1',
      community_id: '1',
      sender_id: '1',
      subject: 'Question about community rules',
      message: 'Hi',
      created_at: new Date(latestCreatedAt),
    },
  });

  latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);
  await prisma.modMail.create({
    data: {
      id: '2',
      community_id: '1',
      sender_id: '1',
      subject: 'Delete that user please',
      message: 'Test',
      created_at: new Date(latestCreatedAt),
    },
  });

  // Create more modmail entries with incrementing timestamps
  for (let i = 3; i < 300; i++) {
    latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

    await prisma.modMail.create({
      data: {
        id: i.toString(),
        community_id: '1',
        sender_id: '1',
        subject: `Modmail Subject ${i}`,
        message: `Message number ${i}`,
        created_at: new Date(latestCreatedAt),
      },
    });
  }
}

import { PrismaClient, ReportedTypes } from '@prisma/client/default';
import { faker } from '@faker-js/faker';

export default async function createReports(prisma: PrismaClient) {
  const latestCreatedAt = new Date();
  latestCreatedAt.setHours(latestCreatedAt.getHours() - 10);

  // Report reasons
  const postReasons = [
    'Contains inappropriate content',
    'Violates community guidelines',
    'Misleading information',
    'Spam content',
    'Harassment or bullying',
    'Hate speech',
    'Impersonation',
    'Copyright violation',
  ];

  const commentReasons = [
    'Offensive language',
    'Harassment',
    'Off-topic content',
    'Spam',
    'Personal attack',
    'Misinformation',
    'Trolling',
    'Threatening content',
  ];

  // First 150 reports for posts
  for (let i = 10; i < 160; i++) {
    // Increment by 1 min for each iteration
    latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

    await prisma.report.create({
      data: {
        reporter_id: `${i}`,
        item_type: ReportedTypes.POST,
        subject: `Reported Post ${i}`,
        reason:
          faker.helpers.arrayElement(postReasons) +
          ': ' +
          faker.lorem.sentence({ min: 3, max: 10 }),
        status: 'PENDING',
        community_id: '1',
        post_id: i.toString(),
        created_at: new Date(latestCreatedAt),
      },
    });
  }

  // Next 150 reports for comments
  for (let i = 50; i < 200; i++) {
    // Increment by 1 min for each iteration
    latestCreatedAt.setMinutes(latestCreatedAt.getMinutes() + 1);

    await prisma.report.create({
      data: {
        reporter_id: `${i}`,
        item_type: ReportedTypes.COMMENT,
        subject: `Reported Comment ${i}`,
        reason:
          faker.helpers.arrayElement(commentReasons) +
          ': ' +
          faker.lorem.sentence({ min: 3, max: 10 }),
        status: 'PENDING',
        community_id: '1',
        comment_id: i.toString(),
        created_at: new Date(latestCreatedAt),
      },
    });
  }

  console.log('Successfully created 300 reports');
}

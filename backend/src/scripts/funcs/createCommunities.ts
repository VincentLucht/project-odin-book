import { faker } from '@faker-js/faker';

import { PrismaClient } from '@prisma/client/default';
import { CommunityType } from '@prisma/client/default';

export default async function createCommunities(prisma: PrismaClient) {
  await prisma.community.create({
    data: {
      id: '1',
      name: 't11',
      type: CommunityType.PUBLIC,
      owner_id: '1',
      description:
        'Lorem ipsum odor amet, consectetuer adipiscing elit. Felis ad finibus tellus placerat vestibulum ridiculus vivamus commodo quam vehicula per nibh facilisi varius semper magna.',
    },
  });

  const totalRecords = 8;
  await prisma.$transaction(async (tx) => {
    for (let index = 2; index < totalRecords; index++) {
      const community = await tx.community.create({
        data: {
          id: index.toString(),
          name:
            index === 2
              ? 'pc1'
              : `${faker.company.name().substring(0, 10)}_${index}`,
          description: faker.lorem.sentence(),
          type: index === 2 ? CommunityType.PRIVATE : CommunityType.PUBLIC,
          owner_id: '1',
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
          user_id: '1',
        },
      });

      await tx.userCommunity.create({
        data: {
          id: `user_community_${index}`,
          community_id: community.id,
          user_id: '1',
          role: 'CONTRIBUTOR',
        },
      });
    }
  });

  // Join communities
  await prisma.userCommunity.create({
    data: {
      id: '1',
      community_id: '1',
      user_id: '1',
      role: 'CONTRIBUTOR',
    },
  });
  await prisma.userCommunity.create({
    data: {
      id: '2',
      community_id: '1',
      user_id: '2',
      role: 'CONTRIBUTOR',
    },
  });

  // Create community rules
  await prisma.communityRule.createMany({
    data: [
      {
        order: 1,
        title: 'Rule number 1',
        text: 'This is rule number 1, wow!',
        community_id: '1',
      },
      {
        order: 2,
        title: 'Rule number 2',
        text: 'Be respectful to all community members',
        community_id: '1',
      },
      {
        order: 3,
        title: 'No spam or self-promotion',
        text: 'Avoid posting content solely for promotional purposes',
        community_id: '1',
      },
      {
        order: 4,
        title: 'Stay on topic',
        text: 'Ensure your posts are relevant to the community',
        community_id: '1',
      },
    ],
  });

  // Create admins
  await prisma.communityModerator.create({
    data: {
      user_id: '1',
      community_id: '1',
    },
  });
  await prisma.communityModerator.create({
    data: {
      user_id: '2',
      community_id: '1',
    },
  });

  console.log('Successfully created Communities with admins');
}

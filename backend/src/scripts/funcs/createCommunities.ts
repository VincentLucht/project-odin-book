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

  await prisma.userCommunity.create({
    data: {
      id: '1',
      community_id: '1',
      user_id: '1',
      role: 'CONTRIBUTOR',
    },
  });

  console.log('Successfully created Communities');
}

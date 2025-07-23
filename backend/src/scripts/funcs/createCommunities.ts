import { faker } from '@faker-js/faker';

import { PrismaClient } from '@prisma/client/default';
import { CommunityType } from '@prisma/client/default';

export default async function createCommunities(prisma: PrismaClient) {
  // Communities for populating search results
  for (let i = 0; i < 300; i++) {
    const isMature = Math.random() < 0.1;
    const isRestricted = Math.random() < 0.1;

    // Increment by 1 min for each iteration
    const createdAt = new Date();
    createdAt.setMinutes(createdAt.getMinutes() + i);

    await prisma.community.create({
      data: {
        name: `test${i + 1}`,
        owner_id: '1',
        is_mature: isMature,
        created_at: createdAt,
        type: isRestricted ? 'RESTRICTED' : 'PUBLIC',
      },
    });
  }

  await prisma.community.create({
    data: {
      id: '1',
      name: 'theodinproject',
      type: CommunityType.PUBLIC,
      owner_id: '1',
      profile_picture_url:
        'https://avatars.githubusercontent.com/u/4441966?s=280&v=4',
      banner_url_desktop:
        'https://www.skillfinder.com.au/media/wysiwyg/the-odin-project-logo-skill-finder-partners-page.png',
      total_members: 127238,
      description:
        "A place to share stories or ask questions about your work with The Odin Project. Connect with fellow learners, celebrate your coding milestones, and get help when you're stuck on challenging concepts. Whether you're just starting your web development journey or working through advanced projects, this community is here to support your growth.",
    },
  });

  // const totalRecords = 8;
  // await prisma.$transaction(async (tx) => {
  //   for (let index = 2; index < totalRecords; index++) {
  //     const community = await tx.community.create({
  //       data: {
  //         id: index.toString(),
  //         name:
  //           index === 2
  //             ? 'pc1'
  //             : `${faker.company.name().substring(0, 10)}_${index}`,
  //         description: faker.lorem.sentence(),
  //         type: index === 2 ? CommunityType.PRIVATE : CommunityType.PUBLIC,
  //         owner_id: '1',
  //       },
  //     });

  //     await tx.communityTopics.createMany({
  //       data: ['1', '2'].map((topicId) => ({
  //         community_id: community.id,
  //         topic_id: topicId,
  //       })),
  //     });

  //     await tx.communityModerator.create({
  //       data: {
  //         community_id: community.id,
  //         user_id: '1',
  //       },
  //     });

  //     await tx.userCommunity.create({
  //       data: {
  //         id: `user_community_${index}`,
  //         community_id: community.id,
  //         user_id: '1',
  //         role: 'CONTRIBUTOR',
  //       },
  //     });
  //   }
  // });

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

  // Create admins - Only for users with ID 1 and 2
  const allUsers = await prisma.user.findMany({
    select: { id: true },
    orderBy: {
      created_at: 'asc',
    },
  });

  // Start timestamp
  const baseTime = new Date();
  const priorityUserIds = ['1', '2', '4'];

  // Only get priority users (users with ID 1 and 2)
  const priorityUsers = allUsers.filter((user) =>
    priorityUserIds.includes(user.id),
  );

  // Create moderators only for priority users
  const createdAt = new Date(baseTime);
  createdAt.setHours(createdAt.getHours() - 10);

  for (let i = 0; i < priorityUsers.length; i++) {
    const user = priorityUsers[i];
    await prisma.communityModerator.create({
      data: {
        user_id: user.id,
        community_id: '1',
        created_at: createdAt,
      },
    });
    createdAt.setMinutes(createdAt.getMinutes() + 1);
  }

  // Add remaining users (excluding admins) to t1 community as regular members
  const existingMemberIds = ['1', '2'];
  const availableUsers = allUsers.filter(
    (user) => !existingMemberIds.includes(user.id),
  );

  const userCommunityData = availableUsers.map((user) => ({
    id: `random_member_${user.id}_community_1`,
    community_id: '1',
    user_id: user.id,
    role: 'CONTRIBUTOR' as const,
  }));

  if (userCommunityData.length > 0) {
    await prisma.userCommunity.createMany({
      data: userCommunityData,
    });
  }

  // Approve users
  await prisma.approvedUser.create({
    data: {
      community_id: '1',
      user_id: '1',
    },
  });

  await prisma.approvedUser.create({
    data: {
      community_id: '1',
      user_id: '2',
    },
  });

  console.log('Successfully created Communities with admins');
}

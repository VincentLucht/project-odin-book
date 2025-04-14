import { PrismaClient } from '@prisma/client/default';

import createTopics from '@/scripts/funcs/createTopics';
import createUsers from '@/scripts/funcs/createUsers';
import createComments from '@/scripts/funcs/createComments';
import createPosts from '@/scripts/funcs/createPosts';
import createCommunities from '@/scripts/funcs/createCommunities';
import createFlairs from '@/scripts/funcs/createFlairs';

const prisma = new PrismaClient();

// Deleting records in a specific order to avoid foreign key constraint issues
async function reset() {
  console.log('Resetting all tables...');

  // Delete chat-related records first
  await prisma.chatAdmin.deleteMany();
  await prisma.message.deleteMany();
  await prisma.userChats.deleteMany();
  await prisma.chat.deleteMany();

  // Delete post and comment related records
  await prisma.notification.deleteMany()
  await prisma.userAssignedFlair.deleteMany();
  await prisma.postAssignedFlair.deleteMany();
  await prisma.communityFlair.deleteMany();
  await prisma.postModeration.deleteMany();
  await prisma.commentModeration.deleteMany();

  await prisma.commentVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postVote.deleteMany();
  await prisma.post.deleteMany();

  // Delete community related records
  await prisma.recentCommunities.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.bannedUser.deleteMany();
  await prisma.communityModerator.deleteMany();
  await prisma.communityTopics.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.mainTopic.deleteMany();
  await prisma.userCommunity.deleteMany();
  await prisma.community.deleteMany();

  // Finally delete users
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  console.log('Reset completed');
}

async function main() {
  await reset();

  await createTopics(prisma);
  await createUsers(prisma);
  await createCommunities(prisma);
  await createPosts(prisma);
  await createComments(prisma);
  await createFlairs(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client/default';

import createTopics from '@/scripts/funcs/createTopics';
import createUsers from '@/scripts/funcs/createUsers';
import createComments from '@/scripts/funcs/createComments';
import createPosts from '@/scripts/funcs/createPosts';
import createCommunities from '@/scripts/funcs/createCommunities';
import createFlairs from '@/scripts/funcs/createFlairs';
import createModmails from '@/scripts/funcs/createModMail';
import createReports from '@/scripts/funcs/createReports';
import createNotifications from '@/scripts/funcs/createNotifications';
import createChatsAndMessages from '@/scripts/funcs/createChatsAndMessages';
import createSavedPostsAndComments from '@/scripts/funcs/createSavedPostsAndComments';

import {
  createDeCommunity,
  createFinanceCommunity,
  createMHWildsCommunity,
} from '@/scripts/funcs/createShowcaseData';
import createOdinProjectCommunity from '@/scripts/funcs/createOdinProjectCommunity';

const prisma = new PrismaClient();

// Deleting records in a specific order to avoid foreign key constraint issues
async function reset() {
  console.log('Resetting all tables...');

  // Delete chat-related records first
  await prisma.chatAdmin.deleteMany();
  await prisma.message.deleteMany();
  await prisma.userChats.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.chatTracker.deleteMany();

  // Delete post and comment related records
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.userAssignedFlair.deleteMany();
  await prisma.postAssignedFlair.deleteMany();
  await prisma.communityFlair.deleteMany();
  await prisma.postModeration.deleteMany();
  await prisma.commentModeration.deleteMany();
  await prisma.savedPost.deleteMany();
  await prisma.savedComment.deleteMany();

  await prisma.commentVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postVote.deleteMany();
  await prisma.post.deleteMany();

  // Delete community related records
  await prisma.modMail.deleteMany();
  await prisma.recentCommunities.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.bannedUser.deleteMany();
  await prisma.communityModerator.deleteMany();
  await prisma.communityTopics.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.mainTopic.deleteMany();
  await prisma.userCommunity.deleteMany();
  await prisma.approvedUser.deleteMany();
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

  await Promise.all([
    createFlairs(prisma),
    createModmails(prisma),
    createReports(prisma),
    createNotifications(prisma),
    createChatsAndMessages(prisma),
    createSavedPostsAndComments(prisma),
    createDeCommunity(prisma),
    createFinanceCommunity(prisma),
    createMHWildsCommunity(prisma),
    createOdinProjectCommunity(prisma),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

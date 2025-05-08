import { PrismaClient, NotificationType } from '@prisma/client/default';

export default async function createNotifications(prisma: PrismaClient) {
  const notificationTypes: NotificationType[] = [
    'COMMUNITYMESSAGE',
    'POSTREPLY',
    'COMMENTREPLY',
    'MODMESSAGE',
    'MODMAILREPLY',
    'CHATMESSAGE',
    'NEWFOLLOWER',
  ];

  const subjects: Record<NotificationType, string> = {
    COMMUNITYMESSAGE: 'New community message',
    POSTREPLY: 'Someone replied to your post',
    COMMENTREPLY: 'Someone replied to your comment',
    MODMESSAGE: 'Message from moderator',
    MODMAILREPLY: 'Reply to your mod mail',
    CHATMESSAGE: 'New chat message',
    NEWFOLLOWER: 'You have a new follower',
  };

  const messages: Record<NotificationType, string> = {
    COMMUNITYMESSAGE: "There's a new announcement in your community.",
    POSTREPLY: 'Your post has received a new reply!',
    COMMENTREPLY: 'Someone has replied to your comment.',
    MODMESSAGE: 'A moderator has sent you a message.',
    MODMAILREPLY: 'Your modmail inquiry has received a response.',
    CHATMESSAGE: 'You received a new direct message.',
    NEWFOLLOWER: 'Someone is now following your profile.',
  };

  const users = await prisma.user.findMany({
    where: {
      OR: [{ id: '1' }, { id: '2' }],
    },
    select: {
      id: true,
    },
  });

  // Get community IDs for community notifications
  const communities = await prisma.community.findMany({
    select: {
      id: true,
    },
  });

  for (let i = 0; i < 300; i++) {
    // Increment by 2 min for each iteration to create a timeline
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - 20);
    createdAt.setMinutes(createdAt.getMinutes() + i * 2);

    const typeIndex = Math.floor(Math.random() * notificationTypes.length);
    const type = notificationTypes[typeIndex];

    // Get random sender and receiver users
    const senderIndex = Math.floor(Math.random() * users.length);
    let receiverIndex;
    do {
      receiverIndex = Math.floor(Math.random() * users.length);
    } while (receiverIndex === senderIndex); // Ensure sender and receiver are different

    const senderId = users[senderIndex].id;
    const receiverId = users[receiverIndex].id;

    const isCommunityNotification =
      type === 'COMMUNITYMESSAGE' && communities.length > 0;

    await prisma.notification.create({
      data: {
        subject: subjects[type],
        message: messages[type],
        created_at: createdAt,
        type,
        sender_user_id: isCommunityNotification ? null : senderId,
        sender_community_id: isCommunityNotification
          ? communities[Math.floor(Math.random() * communities.length)].id
          : null,
        receiver_id: receiverId,
      },
    });
  }

  console.log('Successfully created 300 notifications');
}

import { NotificationType, PrismaClient } from '@prisma/client/default';
import UserManager from '@/db/managers/userManager/userManager';

export default class NotificationManager {
  constructor(
    private prisma: PrismaClient,
    private user: UserManager,
  ) {}

  async getById(notification_id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notification_id },
    });

    return notification;
  }

  async fetchBy(
    user_id: string,
    sortByType: 'all' | 'read' | 'unread',
    includeHidden: boolean,
    cursorId: string | undefined,
    take = 30,
  ) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        receiver_id: user_id,
        ...(sortByType === 'unread' && {
          read_at: null,
        }),
        ...(includeHidden === false && {
          is_hidden: false,
        }),
      },
      ...(cursorId && {
        cursor: {
          id: cursorId,
        },
        skip: 1,
      }),
      include: {
        sender_user: {
          select: {
            profile_picture_url: true,
            username: true,
          },
        },
        sender_community: {
          select: {
            profile_picture_url: true,
            name: true,
          },
        },
      },
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
      take,
    });

    return {
      notifications,
      pagination: {
        nextCursor: notifications?.[notifications?.length - 1]?.id ?? null,
        hasMore: notifications?.length === take,
      },
    };
  }

  async hasUnread(user_id: string) {
    const unreadNotification = await this.prisma.notification.findFirst({
      where: {
        receiver_id: user_id,
        opened_at: null,
      },
      select: {
        id: true,
      },
    });

    return unreadNotification !== null;
  }

  async markAllAsRead(user_id: string) {
    await this.prisma.notification.updateMany({
      where: { receiver_id: user_id, read_at: null },
      data: {
        read_at: new Date(),
        opened_at: new Date(),
      },
    });
  }

  async openAll(user_id: string) {
    await this.prisma.notification.updateMany({
      where: { receiver_id: user_id, opened_at: null },
      data: {
        opened_at: new Date(),
      },
    });
  }

  async read(user_id: string, notification_id: string) {
    await this.prisma.notification.update({
      where: { id: notification_id, receiver_id: user_id },
      data: {
        read_at: new Date(),
      },
    });
  }

  async hide(user_id: string, notification_id: string, hide: boolean) {
    await this.prisma.notification.update({
      where: { id: notification_id, receiver_id: user_id },
      data: {
        is_hidden: hide,
      },
    });
  }

  shouldSendNotification(
    type: NotificationType,
    userSettings: any,
    receiver_id: string,
    sender_id: string,
  ): boolean {
    if (receiver_id === sender_id) {
      return false;
    }

    switch (type) {
      case 'COMMUNITYMESSAGE':
        return userSettings.community_enabled;
      case 'POSTREPLY':
        return userSettings.posts_enabled;
      case 'COMMENTREPLY':
        return userSettings.comments_enabled;
      case 'MODMESSAGE':
        return userSettings.mods_enabled;
      case 'CHATMESSAGE':
        return userSettings.chats_enabled;
      case 'NEWFOLLOWER':
        return userSettings.follows_enabled;
      default:
        return true;
    }
  }

  async send(
    sender_type: 'community' | 'user',
    sender_id: string, // ? either user_id or community id
    receiver_id: string | null,
    type: NotificationType,
    subject: string,
    message: string,
    link?: string,
  ) {
    if (!receiver_id) return;

    const receiverUser = await this.user.getSettings(receiver_id, true);

    const shouldSend = this.shouldSendNotification(
      type,
      receiverUser?.user_settings,
      receiver_id,
      sender_id,
    );

    if (shouldSend) {
      await this.prisma.notification.create({
        data: {
          ...(sender_type === 'community' && {
            sender_community_id: sender_id,
          }),
          ...(sender_type === 'user' && {
            sender_user_id: sender_id,
          }),
          receiver_id,
          type,
          subject,
          message: message.slice(0, 210),
          link,
        },
      });
    }
  }
}

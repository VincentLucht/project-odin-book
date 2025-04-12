import { NotificationType, PrismaClient } from '@prisma/client/default';
import UserManager from '@/db/managers/userManager/userManager';

export default class NotificationManager {
  constructor(
    private prisma: PrismaClient,
    private user: UserManager,
  ) {}

  shouldSendNotification(type: NotificationType, userSettings: any): boolean {
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

  async sendNotification(
    sender_id: string,
    receiver_id: string,
    type: NotificationType,
    message?: string,
  ) {
    const user = await this.user.getSettings(receiver_id, true);

    const shouldSend = this.shouldSendNotification(type, user?.user_settings);

    if (shouldSend) {
      await this.prisma.notification.create({
        data: {
          sender_id,
          receiver_id,
          type,
          message,
        },
      });
    }
  }
}

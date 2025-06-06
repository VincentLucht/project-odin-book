import { PrismaClient } from '@prisma/client/default';

export default class UserChatManager {
  constructor(private prisma: PrismaClient) {}

  async fetch(user_id: string, cursor_id: string | undefined) {
    const chats = await this.prisma.userChats.findMany({
      where: { user_id },
      orderBy: { chat: { updated_at: 'desc' } },
      include: {
        chat: {
          select: {
            id: true,
            name: true,
            is_group_chat: true,
            last_message_id: true,
            last_message: {
              select: {
                user_id: true,
                user: { select: { username: true } },
                is_system_message: true,
                content: true,
                time_created: true,
              },
            },
            owner_id: true,
            profile_picture_url: true,
            updated_at: true,
            existing_one_on_one_chats: {
              include: {
                user1: {
                  select: {
                    id: true,
                    username: true,
                    profile_picture_url: true,
                    deleted_at: true,
                  },
                },
                user2: {
                  select: {
                    id: true,
                    username: true,
                    profile_picture_url: true,
                    deleted_at: true,
                  },
                },
              },
            },
          },
        },
      },
      ...(cursor_id && {
        cursor: {
          id: cursor_id,
        },
        skip: 1,
      }),
    });

    return chats;
  }

  async hasNewMessages(user_id: string) {
    const result: any[] = await this.prisma.$queryRaw`
      SELECT 1
      FROM "UserChats" AS uc
      INNER JOIN "Chat" AS c ON c.id = uc.chat_id
      INNER JOIN "Message" AS lm ON lm.id = c.last_message_id
      WHERE uc.user_id = ${user_id}
      AND uc.last_read_at < lm.time_created
      AND uc.is_muted = false
      LIMIT 1
    `;

    return result.length > 0;
  }

  async isMemberById(chat_id: string, user_id: string) {
    const membership = await this.prisma.userChats.findUnique({
      where: {
        user_id_chat_id: {
          user_id,
          chat_id,
        },
      },
    });

    return membership !== null;
  }

  async muteChat(chat_id: string, user_id: string, is_muted: boolean) {
    await this.prisma.userChats.update({
      where: {
        user_id_chat_id: {
          chat_id,
          user_id,
        },
      },
      data: {
        is_muted,
      },
    });
  }

  async read(user_id: string, chat_id: string) {
    await this.prisma.userChats.update({
      where: {
        user_id_chat_id: {
          user_id,
          chat_id,
        },
      },
      data: {
        last_read_at: new Date(),
      },
    });
  }

  async leave(
    chat_id: string,
    user_id: string,
    username: string,
    is_group_chat: boolean,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.userChats.delete({
        where: { user_id_chat_id: { chat_id, user_id } },
      });

      if (!is_group_chat) {
        await tx.chatTracker.deleteMany({
          where: { chat_id },
        });
      }

      // Delete if no members
      const remainingMembers = await tx.userChats.count({
        where: { chat_id },
      });

      if (remainingMembers === 0) {
        await tx.chat.delete({
          where: { id: chat_id },
        });
      } else if (!is_group_chat && remainingMembers === 1) {
        await tx.chat.update({
          where: { id: chat_id },
          data: {
            name: `Old chat with [${username}]`,
          },
        });
      }

      return remainingMembers;
    });
  }
}

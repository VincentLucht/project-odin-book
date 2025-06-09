import { PrismaClient } from '@prisma/client/default';

export default class ChatManager {
  constructor(private prisma: PrismaClient) {}

  async doesExist_1on1(user1_id: string, user2_id: string) {
    const doesExist = await this.prisma.chatTracker.findFirst({
      where: {
        OR: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id },
        ],
      },
    });

    return doesExist;
  }

  async canCreateChat(user_id: string) {
    const settings = await this.prisma.userSettings.findUnique({
      where: { user_id },
    });

    return settings?.chats_enabled;
  }

  async getById(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
    });

    return chat;
  }

  async fetch(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        last_message: {
          select: {
            user_id: true,
            user: { select: { username: true } },
            is_system_message: true,
            content: true,
            time_created: true,
          },
        },
        messages: {
          take: 50,
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile_picture_url: true,
                deleted_at: true,
              },
            },
          },
          orderBy: { time_created: 'desc' },
        },
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
    });

    return {
      chat,
      pagination: {
        nextCursor: chat?.messages?.[chat.messages.length - 1]?.id,
        hasMore: chat?.messages?.length === 50,
      },
    };
  }

  async create(
    owner_id: string,
    user2_id: string,
    name: string,
    is_group_chat = false,
    profile_picture_url?: string,
    chat_description?: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      let chat = await tx.chat.create({
        data: {
          name: is_group_chat ? name : 'one-on-one',
          profile_picture_url: is_group_chat ? profile_picture_url : undefined,
          chat_description: is_group_chat ? chat_description : undefined,
          owner_id,
          is_group_chat,
          userChats: {
            create: [
              {
                user: {
                  connect: {
                    id: owner_id,
                  },
                },
              },
              {
                user: {
                  connect: {
                    id: user2_id,
                  },
                },
              },
            ],
          },
        },
        include: is_group_chat
          ? {
              userChats: {
                where: { user_id: owner_id },
              },
            }
          : {
              userChats: {
                where: { user_id: owner_id },
              },
            },
      });

      if (!is_group_chat) {
        const chatTracker = await tx.chatTracker.create({
          data: {
            chat_id: chat.id,
            owner_id,
            user1_id: owner_id,
            user2_id,
          },
        });

        const user2 = await tx.user.findUnique({
          where: {
            id: user2_id,
          },
        });

        if (!user2) return;

        chat = {
          ...chat,
          userChats: chat.userChats,
          existing_one_on_one_chats: [
            {
              id: chatTracker.id,
              chat_id: chat.id,
              owner_id,
              user1_id: owner_id,
              user1: {
                id: 'owner',
                username: 'owner',
                profile_picture_url: 'owner',
              },
              user2_id,
              user2: {
                id: user2.id,
                username: user2.username,
                profile_picture_url: user2.profile_picture_url,
              },
            },
          ],
        } as any;
      }

      return chat;
    });
  }

  async update(
    chat_id: string,
    updateData: Partial<{
      name?: string;
      profile_picture_url?: string;
      chat_description?: string;
    }>,
  ) {
    await this.prisma.chat.update({
      where: { id: chat_id },
      data: updateData,
    });
  }

  async delete(chat_id: string, owner_id: string) {
    await this.prisma.chat.delete({
      where: { id: chat_id, owner_id },
    });
  }
}

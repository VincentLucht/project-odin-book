import { PrismaClient } from '@prisma/client/default';

export default class MessageManager {
  constructor(private prisma: PrismaClient) {}

  async fetch(chat_id: string, cursorId: string | undefined, take = 30) {
    const messages = await this.prisma.message.findMany({
      where: { chat_id },
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
      ...(cursorId && {
        cursor: {
          id: cursorId,
        },
        skip: 1,
      }),
      orderBy: {
        time_created: 'desc',
      },
      take,
    });

    return {
      messages,
      pagination: {
        nextCursor: messages[messages.length - 1]?.id,
        hasMore: messages.length === take,
      },
    };
  }

  async send(
    chat_id: string,
    user_id: string,
    message: string,
    options?: { is_system_message?: boolean },
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const sentMessage = await tx.message.create({
        data: {
          chat_id,
          user_id,
          content: message,
          iv: '',
          is_system_message: options?.is_system_message ?? false,
        },
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
      });

      await tx.chat.update({
        where: { id: chat_id },
        data: {
          last_message_id: sentMessage.id,
        },
      });

      return sentMessage;
    });
  }
}

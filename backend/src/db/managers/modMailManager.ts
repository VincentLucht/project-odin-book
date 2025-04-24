import { PrismaClient } from '@prisma/client/default';

export default class ModMailManager {
  constructor(private prisma: PrismaClient) {}

  async getById(modmail_id: string) {
    const modmail = await this.prisma.modMail.findUnique({
      where: { id: modmail_id },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            profile_picture_url: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return modmail;
  }

  async fetch(
    community_id: string,
    cursorId: string,
    onlyArchived: boolean,
    getArchived: boolean,
    getReplied: boolean,
    take = 30,
  ) {
    const modmail = await this.prisma.modMail.findMany({
      where: {
        community_id,
        ...(onlyArchived
          ? { is_archived: true }
          : getArchived === false
            ? { is_archived: false }
            : {}),
        ...(getReplied === false ? { has_replied: false } : {}),
      },
      include: {
        community: {
          select: {
            id: true,
            name: true,
            profile_picture_url: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      ...(cursorId && {
        cursor: { id: cursorId },
        skip: 1,
      }),
      orderBy: [{ created_at: 'desc' }, { id: 'asc' }],
      take,
    });

    const hasMore = modmail.length === take;
    const lastModMail = modmail[modmail?.length - 1];
    const nextCursor = hasMore ? lastModMail?.id : null;

    return { modmail, pagination: { nextCursor, hasMore } };
  }

  async sendMessage(
    community_id: string,
    user_id: string,
    subject: string,
    message: string,
  ) {
    await this.prisma.modMail.create({
      data: {
        community_id,
        sender_id: user_id,
        subject,
        message,
      },
    });
  }

  async update(
    modmail_id: string,
    data: Partial<{ archived: boolean; replied: boolean }>,
  ) {
    await this.prisma.modMail.update({
      where: { id: modmail_id },
      data: {
        is_archived: data.archived,
        has_replied: data.replied,
      },
    });
  }
}

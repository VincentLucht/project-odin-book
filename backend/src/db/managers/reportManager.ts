import { PrismaClient } from '@prisma/client/default';

export default class ReportManager {
  constructor(private prisma: PrismaClient) {
    this.delete = this.delete.bind(this);
  }

  async get(user_id: string) {
    const recent = await this.prisma.recentCommunities.findMany({
      where: { user_id },
      orderBy: { interacted_at: 'desc' },
      include: {
        community: {
          select: {
            name: true,
            profile_picture_url: true,
          },
        },
      },
    });

    return recent;
  }

  async alreadyReported(
    type: 'POST' | 'COMMENT',
    user_id: string,
    item_id: string,
  ) {
    const count = await this.prisma.report.count({
      where: {
        item_type: type,
        reporter_id: user_id,
        ...(type === 'POST' ? { post_id: item_id } : { comment_id: item_id }),
      },
    });

    return count > 0;
  }

  async report(
    type: 'POST' | 'COMMENT',
    user_id: string,
    item_id: string,
    subject: string,
    reason: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // Create report
      const report = await tx.report.create({
        data: {
          item_type: type,
          reporter_id: user_id,
          ...(type === 'POST' ? { post_id: item_id } : { comment_id: item_id }),
          subject,
          reason,
          status: 'PENDING',
        },
      });

      // Increment report number
      if (type === 'POST') {
        await tx.post.update({
          where: { id: item_id },
          data: {
            times_reported: { increment: 1 },
          },
        });
      } else if (type === 'COMMENT') {
        await tx.comment.update({
          where: { id: item_id },
          data: {
            times_reported: { increment: 1 },
          },
        });
      }

      return report;
    });
  }

  async delete(user_id: string, community_id: string) {}
}

import { ModerationType, PrismaClient } from '@prisma/client/default';

export default class CommentModerationManager {
  constructor(private prisma: PrismaClient) {}

  // ! CREATE
  async moderate(
    comment_id: string,
    mod_id: string,
    moderation_action: ModerationType,
  ) {
    await this.prisma.commentModeration.create({
      data: {
        comment_id,
        moderator_id: mod_id,
        action: moderation_action,
      },
    });
  }

  async updateModeration(
    comment_id: string,
    moderation_action: ModerationType,
    moderator_id: string,
    reason?: string,
  ) {
    await this.prisma.commentModeration.update({
      where: { comment_id },
      data: {
        action: moderation_action,
        reason: moderation_action === 'APPROVED' ? null : reason,
        created_at: new Date(),
        moderator_id,
      },
    });
  }
}

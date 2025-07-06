import { ModerationType, PrismaClient } from '@prisma/client/default';

export default class PostModerationManager {
  constructor(private prisma: PrismaClient) {}

  // ! CREATE
  async moderate(
    post_id: string,
    mod_id: string,
    moderation_action: ModerationType,
  ) {
    await this.prisma.postModeration.create({
      data: {
        post_id,
        moderator_id: mod_id,
        action: moderation_action,
      },
    });
  }

  // ! UPDATE
  async updateModeration(
    post_id: string,
    moderation_action: ModerationType,
    moderator_id: string,
    reason?: string,
  ) {
    await this.prisma.postModeration.update({
      where: { post_id },
      data: {
        action: moderation_action,
        reason: moderation_action === 'APPROVED' ? null : reason,
        created_at: new Date(),
        moderator_id,
      },
    });
  }

  async updatePostAsModerator(
    post_id: string,
    updateData: Partial<{
      is_mature: boolean;
      is_spoiler: boolean;
      lock_comments: boolean;
    }>,
  ) {
    await this.prisma.post.update({
      where: { id: post_id },
      data: updateData,
    });
  }
}

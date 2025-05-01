import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import { ModerationType } from '.prisma/client';
import getAuthUser from '@/util/getAuthUser';

class CommentModerationController {
  moderateComment = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { comment_id, reason, moderation_action, dismiss_reason } =
      req.body as {
        comment_id: string;
        reason?: string;
        moderation_action: ModerationType;
        dismiss_reason?: string;
      };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = await db.comment.getByIdAndModeration(comment_id, true);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      const moderator = await db.communityModerator.getById(
        user_id,
        comment.post.community_id,
      );
      if (!moderator || !moderator.is_active) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }

      const sendNotification = async () => {
        if (comment.user_id && moderation_action === 'REMOVED') {
          await db.notifications.sendNotification(
            'user',
            user_id,
            comment.user_id,
            'MODMESSAGE',
            `Removal of comment ${comment_id}`,
            reason,
          );
        }
      };

      if (comment?.moderation) {
        if (comment.moderation.moderator_id !== moderator.id) {
          return res.status(409).json({
            message: 'This comment was already moderated by another user',
          });
        }

        if (
          (comment.moderation.action === moderation_action && !reason) ||
          comment.moderation.reason === reason
        ) {
          return res
            .status(304)
            .json({ message: 'Identical moderation action' });
        }

        await db.commentModeration.updateModeration(
          comment_id,
          moderation_action,
          reason,
        );

        await sendNotification();

        return res
          .status(200)
          .json({ message: 'Successfully updated comment moderation' });
      }

      await db.commentModeration.moderate(
        comment_id,
        moderator.id,
        moderation_action,
      );

      await sendNotification();

      await db.report.updateAllPendingReports(
        comment.id,
        moderator.id,
        'COMMENT',
        moderation_action === 'APPROVED' ? 'REVIEWED' : 'DISMISSED',
        dismiss_reason,
      );

      return res
        .status(201)
        .json({ message: 'Successfully moderated comment' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to moderate comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const commentModerationController = new CommentModerationController();
export default commentModerationController;

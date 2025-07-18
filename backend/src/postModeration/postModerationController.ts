import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import { ModerationType } from '.prisma/client';
import getAuthUser from '@/util/getAuthUser';

class PostModerationController {
  moderatePost = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id, reason, moderation_action, dismiss_reason } = req.body as {
      post_id: string;
      reason?: string;
      moderation_action: ModerationType;
      dismiss_reason?: string;
    };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const post = await db.post.getByIdAndModerator(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      const moderator = await db.communityModerator.getById(
        user_id,
        post.community_id,
      );
      if (!moderator || !moderator.is_active) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }

      const sendNotification = async () => {
        if (post.poster_id && moderation_action === 'REMOVED') {
          await db.notification.send(
            'user',
            user_id,
            post.poster_id,
            'MODMESSAGE',
            `Removal of post ${post.title} in r/${community!.name}`,
            reason
              ? `Your post "${post.title}" in r/${community!.name} has been removed. Reason: ${reason}`
              : `Your post "${post.title}" was removed by the moderators of r/${community!.name}. If you think this was a mistake, you can message the moderators and try to appeal this decision.`,
            post.id, // TODO: Add mod message detail view
          );
        }
      };

      const updateAllPendingReports = async () => {
        await db.report.updateAllPendingReports(
          post_id,
          moderator.id,
          'POST',
          moderation_action === 'APPROVED' ? 'REVIEWED' : 'DISMISSED',
          dismiss_reason,
        );
      };

      if (post?.moderation) {
        if (post.moderation.moderator_id !== moderator.id) {
          if (!(await db.community.isOwner(user_id, community.id))) {
            return res.status(409).json({
              message: 'This post was already moderated by another moderator',
            });
          }
        }

        if (
          (post.moderation.action === moderation_action && !reason) ||
          post.moderation.reason === reason
        ) {
          return res
            .status(200)
            .json({ message: 'Identical moderation action' });
        }

        await db.postModeration.updateModeration(
          post_id,
          moderation_action,
          moderator.id,
          reason,
        );

        await sendNotification();
        await updateAllPendingReports();

        return res
          .status(200)
          .json({ message: 'Successfully updated post moderation' });
      }

      await db.postModeration.moderate(
        post_id,
        moderator.id,
        moderation_action,
      );

      await sendNotification();
      await updateAllPendingReports();

      return res.status(201).json({ message: 'Successfully moderated post' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to moderate post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  updatePostAsModerator = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id, is_mature, is_spoiler, lock_comments } = req.body as {
      post_id: string;
      is_mature?: boolean;
      is_spoiler?: boolean;
      lock_comments?: boolean;
    };

    if (
      is_mature === undefined &&
      is_spoiler === undefined &&
      lock_comments === undefined
    ) {
      return res.status(400).json({
        message:
          'At least one update field (is_mature, is_spoiler, or lock_comments) must be provided',
      });
    }

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const post = await db.post.getByIdAndModerator(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const moderator = await db.communityModerator.getById(
        user_id,
        post.community_id,
      );
      if (!moderator || !moderator.is_active) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }

      await db.postModeration.updatePostAsModerator(post_id, {
        is_mature,
        is_spoiler,
        lock_comments,
      });

      return res.status(201).json({ message: 'Successfully updated post' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to update post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const postModerationController = new PostModerationController();
export default postModerationController;

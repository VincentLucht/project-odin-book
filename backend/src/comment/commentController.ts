import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import checkCommunityPermissions from '@/util/checkCommunityPermissions';

class CommentController {
  // ! POST
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { content, post_id, parent_comment_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const post = await db.post.getById(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      const permissionCheck = await checkCommunityPermissions({
        db,
        userId: user_id,
        community,
        action: 'comment',
      });
      if (!permissionCheck.isAllowed) {
        return res
          .status(permissionCheck.status ?? 400)
          .json({ message: permissionCheck.message });
      }

      if (parent_comment_id) {
        const parentComment = await db.comment.getById(parent_comment_id);
        if (!parentComment) {
          return res
            .status(409)
            .json({ message: 'Parent comment was not found' });
        }
      }

      const comment = await db.comment.create(
        content,
        post_id,
        user_id,
        parent_comment_id,
      );

      return res.status(201).json({
        message: parent_comment_id
          ? 'Successfully replied to Comment'
          : 'Successfully posted Comment',
        comment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create Comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const commentController = new CommentController();
export default commentController;

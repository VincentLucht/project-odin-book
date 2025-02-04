import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import checkCommunityPermissions from '@/util/checkCommunityPermissions';
import checkPrivateCommunityMembership from '@/util/checkPrivateCommunityMembership';

class CommentController {
  // ! GET
  get = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id } = req.params;

    try {
      const post = await db.post.getById(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      await checkPrivateCommunityMembership(db, post, undefined, req, res);

      const comments = await db.comment.getCommentThreads(post.id);

      return res.status(200).json({
        message: 'Successfully fetched comments',
        comments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch Comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! POST
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { content, post_id, parent_comment_id } = req.body;

    // TODO: Upvote on creation

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
          return res.status(404).json({ message: 'Parent comment not found' });
        }
        if (parentComment.is_deleted) {
          return res
            .status(400)
            .json({ message: 'Cannot reply to a deleted comment' });
        }
        if (parentComment.post_id !== post_id) {
          return res.status(400).json({
            message: 'Cannot reply to a comment from a different post',
          });
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

  // ! PUT

  // ! DELETE
  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { comment_id } = req.body;

    // TODO: remove upvotes and downvotes from comment

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = await db.comment.getById(comment_id, true);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      if (comment.is_deleted) {
        return res.status(410).json({ message: 'Comment is already deleted' });
      }
      if (comment.user_id !== user_id) {
        return res
          .status(403)
          .json({ message: 'You cannot delete other Comments' });
      }

      const post = await db.post.getById(comment.post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      // Don't allow to delete comments for private community where user lost membership
      // Allow everything else, i.e. Non-Contributor to edit already posted comment in community
      if (community.type === 'PRIVATE') {
        const member = await db.userCommunity.isMember(user_id, community.id);
        if (!member) {
          return res.status(403).json({
            message:
              'You must be a member of this private community to modify your comments',
          });
        }
      }

      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      // Fully delete comment if no reply, else soft delete
      if ('replies' in comment && comment.replies?.length) {
        await db.comment.softDelete(comment_id, user_id);
      } else {
        await db.comment.delete(comment_id, user_id);
      }

      return res.status(200).json({ message: 'Successfully deleted Comment' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete Comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const commentController = new CommentController();
export default commentController;

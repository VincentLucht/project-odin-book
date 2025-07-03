import { Request, Response } from 'express';

import db from '@/db/db';
import slugify from 'slugify';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import checkCommunityPermissions from '@/util/checkCommunityPermissions';
import checkPrivateCommunityMembership from '@/util/checkPrivateCommunityMembership';
import { TimeFrame } from '@/db/managers/util/types';

export interface AuthPayload {
  id: string | undefined;
}

class CommentController {
  // ! GET
  get = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      pId: postId,
      sbt: sortByType,
      cId: cursorId,
      t: timeframe,
    } = req.query as {
      pId: string;
      sbt: 'top' | 'new';
      cId: string;
      t: TimeFrame;
    };

    try {
      const post = await db.post.getById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // TODO: HIDE PRIVATE COMMENTS
      const response = await checkPrivateCommunityMembership(
        db,
        post,
        req.authData,
        true,
      );
      if (!response.ok) {
        return res
          .status(response.status ?? 500)
          .json({ message: response.message });
      }

      const userId = req.authData
        ? (req.authData as AuthPayload).id
        : undefined;

      const { comments, pagination } = await db.comment.getCommentThreads(
        post.id,
        sortByType,
        userId,
        cursorId,
        timeframe,
      );

      return res.status(200).json({
        message: 'Successfully fetched comments',
        comments,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch Comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  getMoreReplies = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id, parent_comment_id } = req.params;

    try {
      const post = await db.post.getById(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // TODO: HIDE PRIVATE COMMENTS
      const response = await checkPrivateCommunityMembership(
        db,
        post,
        req.authData,
        true,
      );
      if (!response.ok) {
        return res
          .status(response.status ?? 500)
          .json({ message: response.message });
      }

      const { id: userId } = req.authData as AuthPayload;

      const comments = await db.comment.getMoreReplies(
        parent_comment_id,
        post.id,
        userId,
      );

      return res.status(200).json({
        message: 'Successfully fetched more replies',
        comments,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch replies',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! POST
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { content, post_id, parent_comment_id } = req.body;

    try {
      const { user_id, username } = getAuthUser(req.authData);
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

      if (post.lock_comments) {
        return res.status(403).json({ message: 'Comments are locked' });
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

      let parentComment = null;
      if (parent_comment_id) {
        parentComment = await db.comment.getById(parent_comment_id);
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

      const notificationType = parent_comment_id ? 'COMMENTREPLY' : 'POSTREPLY';
      const notificationTypeString = parent_comment_id ? 'comment' : 'post';
      const baseUrl = `/r/${community.name}/${post.id}/${slugify(post.title, { lower: true })}/${comment.id}`;
      const recipientId = parent_comment_id
        ? (parentComment?.user_id ?? '')
        : post.poster_id;
      await db.notification.send(
        'user',
        user_id,
        recipientId,
        notificationType,
        `u/${username} replied to your ${notificationTypeString} in r/${community.name}`,
        content,
        notificationType === 'COMMENTREPLY'
          ? `${baseUrl}?reply=${comment.id}`
          : baseUrl,
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
  update = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { comment_id, new_content } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = await db.comment.getById(comment_id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      if (comment.is_deleted) {
        return res.status(410).json({ message: 'Comment is deleted' });
      }
      if (comment.user_id !== user_id) {
        return res
          .status(403)
          .json({ message: 'You cannot edit other Comments' });
      }

      const post = await db.post.getById(comment.post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.lock_comments) {
        return res.status(403).json({ message: 'Comments are locked' });
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

      const updatedComment = await db.comment.update(
        comment.id,
        user_id,
        new_content,
      );

      return res
        .status(200)
        .json({ message: 'Successfully updated Comment', updatedComment });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to update Comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

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

      await db.comment.softDelete(comment_id, user_id);
      // Fully delete comment if no reply, else soft delete
      // if ('replies' in comment && comment.replies?.length) {
      //   await db.comment.softDelete(comment_id, user_id);
      // } else {
      //   await db.comment.delete(comment_id, user_id);
      // }

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

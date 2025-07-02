import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class SavedPostsAndCommentsController {
  // ! READ
  fetchSavedPosts = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { cId: cursor_id } = req.query as {
      cId: string | undefined;
    };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { posts, pagination } = await db.savedPost.fetch(
        user_id,
        cursor_id,
      );

      return res.status(200).json({
        message: 'Successfully fetched saved posts',
        posts,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed fetch saved posts',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  fetchSavedComments = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { cId: cursor_id } = req.query as {
      cId: string | undefined;
    };

    try {
      const { user_id } = getAuthUser(req.authData);

      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { comments, pagination } = await db.savedComment.fetch(
        user_id,
        cursor_id,
      );

      return res.status(200).json({
        message: 'Successfully fetched saved comments',
        comments,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch saved comments',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! CREATE
  savePost = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id } = req.body;

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
      if (
        community.type === 'PRIVATE' &&
        !(await db.userCommunity.isMember(user_id, community.id))
      ) {
        return res
          .status(403)
          .json({ message: 'You are not a member of this community' });
      }

      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(400)
          .json({ message: 'You are banned from this community' });
      }

      if (await db.savedPost.isSaved(user_id, post_id)) {
        return res.status(400).json({ message: 'You already saved this post' });
      }

      await db.savedPost.save(user_id, post_id);

      return res.status(201).json({
        message: 'Successfully saved post',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to saved post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  saveComment = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { comment_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = await db.comment.getById(comment_id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      const post = await db.post.getById(comment.post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (
        community.type === 'PRIVATE' &&
        !(await db.userCommunity.isMember(user_id, community.id))
      ) {
        return res
          .status(403)
          .json({ message: 'You are not a member of this community' });
      }
      if (await db.savedComment.isSaved(user_id, comment_id)) {
        return res
          .status(400)
          .json({ message: 'You already saved this comment' });
      }

      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      await db.savedComment.save(user_id, comment_id);

      return res.status(201).json({
        message: 'Successfully saved comment',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to save Comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! DELETE
  unsavePost = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id } = req.body;

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
      if (!(await db.savedPost.isSaved(user_id, post_id))) {
        return res.status(400).json({ message: 'You did not save this post' });
      }

      await db.savedPost.unsave(user_id, post_id);

      return res.status(200).json({
        message: 'Successfully unsaved post',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to unsave post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  unsaveComment = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { comment_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = await db.comment.getById(comment_id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      const post = await db.post.getById(comment.post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (
        community.type === 'PRIVATE' &&
        !(await db.userCommunity.isMember(user_id, community.id))
      ) {
        return res
          .status(403)
          .json({ message: 'You are not a member of this community ' });
      }
      if (!(await db.savedComment.isSaved(user_id, comment_id))) {
        return res
          .status(400)
          .json({ message: 'You did not save this comment' });
      }

      await db.savedComment.unsave(user_id, comment_id);

      return res.status(200).json({
        message: 'Successfully unsaved comment',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to unsave Comment',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const savedPostsAndCommentsController = new SavedPostsAndCommentsController();
export default savedPostsAndCommentsController;

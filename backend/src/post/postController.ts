import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import isFlairValid from '@/post/util/isFlairValid';
import isPostTypeValid from '@/post/util/isPostTypeValid';
import checkCommunityPermissions from '@/util/checkCommunityPermissions';
import checkPrivateCommunityMembership from '@/util/checkPrivateCommunityMembership';

class PostController {
  get = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id } = req.params;

    try {
      const post = await db.post.getById(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const response = await checkPrivateCommunityMembership(
        db,
        post,
        req.authData,
        true,
      );
      if (!response.ok) {
        return res
          .status(response?.status ?? 500)
          .json({ message: response?.message });
      }

      const postAndCommunity = await db.post.getByIdAndCommunity(
        post.id,
        response.user_id,
      );

      return res
        .status(200)
        .json({ message: 'Successfully fetched post', postAndCommunity });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, title, body, is_spoiler, is_mature, type, flair_id } =
      req.body;

    // TODO: Upvote on creation

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      const permissionCheck = await checkCommunityPermissions({
        db,
        userId: user_id,
        community,
        action: 'post',
      });
      if (!permissionCheck.isAllowed) {
        return res
          .status(permissionCheck.status ?? 400)
          .json({ message: permissionCheck.message });
      }

      isPostTypeValid(type);

      // Validate flair only if required or if one was provided
      if (community.is_post_flair_required || flair_id) {
        await isFlairValid(flair_id, community);
      }
      const isBanned = await db.bannedUsers.isBanned(user_id, community_id);
      if (isBanned) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      const post = await db.post.create(
        community_id,
        user_id,
        title,
        body,
        is_spoiler,
        is_mature,
        type,
        flair_id,
      );

      return res.status(201).json({
        message: 'Successfully created post',
        post,
        communityName: community.name,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  edit = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id, body, is_spoiler, is_mature, flair_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      const post = await db.post.getById(post_id);
      if (post?.deleted_at) {
        return res.status(404).json({ message: 'Post was delete' });
      }
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      // Don't allow to remove flair when editing
      if (community.is_post_flair_required && !flair_id) {
        return res
          .status(400)
          .json({ message: 'Flair is required for this community' });
      }

      if (post.poster_id !== user_id) {
        return res
          .status(403)
          .json({ message: 'You are not allowed to edit this post' });
      }

      const hasFlair = await db.postAssignedFlair.getPostFlairInCommunity(
        post_id,
        post.community_id,
      );

      // Validate flair only if required or if one was provided
      if (community.is_post_flair_required || flair_id) {
        await isFlairValid(flair_id, community);
      }
      const isBanned = await db.bannedUsers.isBanned(
        user_id,
        post.community_id,
      );
      if (isBanned) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      await db.post.edit(
        post_id,
        body,
        is_spoiler,
        is_mature,
        flair_id,
        hasFlair !== null,
      );

      let newFlair;
      if (flair_id) {
        newFlair =
          await db.postAssignedFlair.getByIdAndCommunityFlair(flair_id);
      }

      return res
        .status(200)
        .json({ message: 'Successfully edited post', newFlair });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to edit post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
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
      if (post.poster_id !== user_id) {
        return res
          .status(403)
          .json({ message: "You cannot delete someone else's post" });
      }

      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      const permissionCheck = await checkCommunityPermissions({
        db,
        userId: user_id,
        community,
        action: 'delete posts',
      });
      if (!permissionCheck.isAllowed) {
        return res
          .status(permissionCheck.status ?? 400)
          .json({ message: permissionCheck.message });
      }

      const isBanned = await db.bannedUsers.isBanned(
        user_id,
        post.community_id,
      );
      if (isBanned) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      await db.post.deletePost(post_id);

      return res.status(200).json({ message: 'Successfully deleted post' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const postController = new PostController();
export default postController;

import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import isFlairValid from '@/post/util/isFlairValid';
import isPostTypeValid from '@/post/util/isPostTypeValid';
import checkCommunityPermissions from '@/util/checkCommunityPermissions';

class PostController {
  get = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id } = req.params;

    try {
      let userId = undefined;

      const post = await db.post.getById(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      if (community.type === 'PRIVATE') {
        if (!req.authData) {
          return res.status(401).json({
            message: 'Authentication required for private community content',
          });
        }

        const { user_id } = getAuthUser(req.authData);
        userId = user_id;

        const isMember = await db.userCommunity.isMember(user_id, community.id);
        if (!isMember) {
          return res
            .status(403)
            .json({ message: 'You are not part of this community' });
        }

        if (await db.bannedUsers.isBanned(user_id, community.id)) {
          return res
            .status(403)
            .json({ message: 'You are banned from this community' });
        }
      }

      const postAndCommunity = await db.post.getByIdAndCommunity(
        post.id,
        userId,
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

      // Check posting permissions based on community type and if basic users are allowed to post
      if (community.type !== 'PUBLIC') {
        const member = await db.userCommunity.getById(user_id, community.id);
        if (!member) {
          return res.status(403).json({
            message: 'You must be a member to post in this community',
          });
        }

        if (community.type === 'RESTRICTED' && member.role !== 'CONTRIBUTOR') {
          return res.status(403).json({
            message: 'Only Contributors can post in restricted communities',
          });
        }

        if (community.type === 'PRIVATE') {
          if (!community.allow_basic_user_posts && member.role === 'BASIC') {
            return res.status(403).json({
              message: 'Basic users cannot post in this community',
            });
          }
        }
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

      return res
        .status(201)
        .json({ message: 'Successfully created post', post });
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

    const { post_id, title, body, is_spoiler, is_mature, flair_id } = req.body;

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

      // Check if post was assigned a flair before updating
      const flair = await db.communityFlair.getById(
        post.community_id,
        flair_id,
      );
      const hadPreviousFlair = flair !== null && flair !== undefined;

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
        title,
        body,
        is_spoiler,
        is_mature,
        flair_id,
        hadPreviousFlair,
      );

      return res.status(200).json({ message: 'Successfully edited post' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to edit post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const postController = new PostController();
export default postController;

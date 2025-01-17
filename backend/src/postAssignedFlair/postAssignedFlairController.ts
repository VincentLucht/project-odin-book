import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class PostAssignedFlairController {
  assign = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id, community_flair_id } = req.body;

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
        return res.status(403).json({ message: 'You are not the post author' });
      }

      if (!(await db.community.doesExistById(post.community_id))) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (!(await db.userCommunity.isMember(user_id, post.community_id))) {
        return res
          .status(403)
          .json({ message: 'Non-members cannot assign post flairs' });
      }
      if (await db.bannedUsers.isBanned(user_id, post.community_id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      const flair = await db.communityFlair.getById(
        post.community_id,
        community_flair_id,
      );
      if (!flair) {
        return res.status(404).json({ message: 'Community flair not found' });
      }
      if (!flair.is_assignable_to_posts) {
        return res
          .status(400)
          .json({ message: 'Flair is only assignable to users' });
      }

      const postFlair = await db.postAssignedFlair.getPostFlairInCommunity(
        post_id,
        post.community_id,
      );
      if (postFlair) {
        if (postFlair.post_id !== post_id) {
          return res
            .status(400)
            .json({ message: 'This flair does not belong to this post' });
        }

        if (postFlair.community_flair_id === community_flair_id) {
          return res
            .status(409)
            .json({ message: 'You already use this flair' });
        }

        await db.postAssignedFlair.update(postFlair.id, community_flair_id);
        return res.status(200).json({ message: 'Successfully updated flair' });
      }

      await db.postAssignedFlair.create(post_id, community_flair_id);

      return res.status(201).json({ message: 'Successfully assigned flair' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to assign flair',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id, post_assigned_flair_id } = req.body;

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
        return res.status(403).json({ message: 'You are not the post author' });
      }

      if (!(await db.community.doesExistById(post.community_id))) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (!(await db.userCommunity.isMember(user_id, post.community_id))) {
        return res
          .status(403)
          .json({ message: 'Non-members cannot assign post flairs' });
      }
      if (await db.bannedUsers.isBanned(user_id, post.community_id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      const postFlair = await db.postAssignedFlair.getById(
        post_assigned_flair_id,
      );
      if (!postFlair) {
        return res.status(404).json({ message: 'Flair not found' });
      }
      if (postFlair.post_id !== post_id) {
        return res
          .status(400)
          .json({ message: 'This flair does not belong to this post' });
      }

      await db.postAssignedFlair.delete(post_assigned_flair_id);

      return res
        .status(200)
        .json({ message: 'Successfully removed post flair' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete flair',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const postAssignedFlairController = new PostAssignedFlairController();
export default postAssignedFlairController;

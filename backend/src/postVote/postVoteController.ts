import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import checkCommunityPermissions from '@/util/checkCommunityPermissions';

class PostVoteController {
  // ! POST
  vote = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { post_id, vote_type } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const post = await db.post.getById(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.deleted_at) {
        return res.status(410).json({ message: 'Post was deleted' });
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
        action: 'vote',
      });
      if (!permissionCheck.isAllowed) {
        return res
          .status(permissionCheck.status ?? 400)
          .json({ message: permissionCheck.message });
      }

      const existingVote = await db.postVote.getById(post_id, user_id);
      if (existingVote) {
        if (existingVote.vote_type === vote_type) {
          return res
            .status(409)
            .json({ message: 'You already voted for this post' });
        } else {
          await db.postVote.update(post_id, user_id, vote_type);
          return res.status(200).json({ message: 'Successfully updated vote' });
        }
      }

      await db.postVote.create(post_id, user_id, vote_type);

      return res.status(201).json({
        message: 'Successfully voted for post',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to vote for post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! DELETE
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
      const community = await db.community.getById(post.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      const previousVote = await db.postVote.getById(post_id, user_id);
      if (!previousVote) {
        return res.status(404).json({ message: 'Vote not found' });
      }

      const permissionCheck = await checkCommunityPermissions({
        db,
        userId: user_id,
        community,
        action: 'vote',
      });
      if (!permissionCheck.isAllowed) {
        return res
          .status(permissionCheck.status ?? 400)
          .json({ message: permissionCheck.message });
      }

      await db.postVote.delete(post_id, user_id, previousVote.vote_type);

      return res
        .status(200)
        .json({ message: 'Successfully removed vote from post' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to remove vote from post',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const postVoteController = new PostVoteController();
export default postVoteController;

import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class CommentVoteController {
  // ! POST
  vote = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { comment_id, vote_type } = req.body;

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
      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      // Allow votes regardless of role, but check if member
      if (community.type === 'RESTRICTED' || community.type === 'PRIVATE') {
        const member = await db.userCommunity.getById(user_id, community.id);
        if (!member) {
          return res.status(403).json({
            message: 'You must be a member of this community to vote',
          });
        }
      }

      const previousVote = await db.commentVote.getById(comment_id, user_id);
      if (previousVote) {
        if (previousVote.vote_type === vote_type) {
          return res
            .status(409)
            .json({ message: 'You already voted for this comment' });
        }

        await db.commentVote.update(comment_id, user_id, vote_type);
        return res
          .status(200)
          .json({ message: 'Successfully updated comment vote' });
      }

      await db.commentVote.create(comment_id, user_id, vote_type);

      return res.status(201).json({
        message: 'Successfully voted for Comment',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create Comment vote',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! DELETE
  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { comment_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const comment = await db.comment.getById(comment_id, true);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      return res.status(200).json({ message: '' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete Comment vote',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const commentVoteController = new CommentVoteController();
export default commentVoteController;

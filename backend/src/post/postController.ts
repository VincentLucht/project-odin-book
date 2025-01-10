import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import isFlairValid from '@/post/util/isFlairValid';
import isPostTypeValid from '@/post/util/isPostTypeValid';

class PostController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, title, body, is_spoiler, is_mature, type, flair_id } =
      req.body;

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
}

const postController = new PostController();
export default postController;

import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class CommunityFlairController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      community_id,
      name,
      color,
      is_assignable_to_posts,
      is_assignable_to_users,
      emoji,
    } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!(await db.community.doesExistById(community_id))) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (await db.communityFlair.doesExistByName(community_id, name)) {
        return res.status(409).json({ message: 'Flair already exists' });
      }
      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }
      // TODO: Add limit of 700 flair types for community

      const flair = await db.communityFlair.create(
        community_id,
        name,
        color,
        is_assignable_to_posts,
        is_assignable_to_users,
        emoji,
      );

      return res
        .status(201)
        .json({ message: 'Successfully created flair', flair });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create flair',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const communityFlairController = new CommunityFlairController();
export default communityFlairController;

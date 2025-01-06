import { Request, Response } from 'express';

import db from '@/db/db';
import checker from '@/util/checker/checker';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class CommunityFlairController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      community_id: id,
      name,
      color,
      is_assignable_to_posts,
      is_assignable_to_users,
      emoji,
    } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (await checker.user.notFoundById(res, user_id)) return;
      if (await checker.community.notFoundById(res, id)) return;
      if (await checker.communityFlair.foundName(res, id, name)) return;
      if (await checker.communityModerator.notFoundById(res, user_id, id)) {
        return;
      }

      const flair = await db.communityFlair.create(
        id,
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
        message: 'Failed to join Community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const communityFlairController = new CommunityFlairController();
export default communityFlairController;

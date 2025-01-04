import { Request, Response } from 'express';

import db from '@/db/db';
import checker from '@/util/checker/checker';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class CommunityController {
  // ! POST
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      name,
      is_mature,
      type,
      topics,
      description,
      profile_picture_url_desktop,
      profile_picture_url_mobile,
      banner_url,
    } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (await checker.user.notFoundById(res, user_id)) return;
      if (await checker.community.foundByName(res, name)) return;

      await db.community.create(
        name,
        is_mature,
        user_id,
        type,
        topics,
        description,
        profile_picture_url_desktop,
        profile_picture_url_mobile,
        banner_url,
      );

      return res
        .status(201)
        .json({ message: 'Successfully created community' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create Community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const communityController = new CommunityController();
export default communityController;

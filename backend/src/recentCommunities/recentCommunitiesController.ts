import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class RecentCommunitiesController {
  get = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const recentCommunities = await db.recentCommunities.get(user_id);

      return res.status(200).json({
        message: 'Successfully fetched recent communities',
        recentCommunities,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch recent communities',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const recentCommunitiesController = new RecentCommunitiesController();
export default recentCommunitiesController;

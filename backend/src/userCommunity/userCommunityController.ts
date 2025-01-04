import { Request, Response } from 'express';

import db from '@/db/db';
import checker from '@/util/checker/checker';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class UserCommunityController {
  join = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id: id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (await checker.user.notFoundById(res, user_id)) return;
      if (await checker.community.notFoundById(res, id)) return;
      if (await checker.userCommunity.isMember(res, user_id, id)) return;
      if (await checker.community.isPrivate(res, id)) return;
      if (await checker.bannedUsers.isBanned(res, user_id, id)) return;

      await db.userCommunity.join(user_id, id);

      return res.status(201).json({ message: 'Successfully joined community' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to join Community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  leave = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id: id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (await checker.user.notFoundById(res, user_id)) return;
      if (await checker.community.notFoundById(res, id)) return;
      if (await checker.userCommunity.isNotMember(res, user_id, id)) return;

      const isMod = await db.communityModerator.isMod(user_id, id);
      if (isMod) {
        await Promise.all([
          db.communityModerator.delete(user_id, id),
          db.userCommunity.leave(user_id, id),
        ]);
      } else {
        await db.userCommunity.leave(user_id, id);
      }

      return res.status(200).json({ message: 'Successfully left community' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to leave Community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const userCommunityController = new UserCommunityController();
export default userCommunityController;

import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class UserCommunityController {
  join = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!(await db.community.doesExistById(community_id))) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (await db.userCommunity.isMember(user_id, community_id)) {
        return res
          .status(409)
          .json({ message: 'You already are a member of this community' });
      }
      if (await db.community.isPrivate(community_id)) {
        return res
          .status(403)
          .json({ message: "You can't join a private community" });
      }
      if (await db.bannedUsers.isBanned(user_id, community_id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      await db.userCommunity.join(user_id, community_id);

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

    const { community_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!(await db.community.doesExistById(community_id))) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (!(await db.userCommunity.isMember(user_id, community_id))) {
        return res
          .status(403)
          .json({ message: 'You are not part of this community' });
      }

      const isMod = await db.communityModerator.isMod(user_id, community_id);
      if (isMod) {
        await Promise.all([
          db.communityModerator.delete(user_id, community_id),
          db.userCommunity.leave(user_id, community_id),
        ]);
      } else {
        await db.userCommunity.leave(user_id, community_id);
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

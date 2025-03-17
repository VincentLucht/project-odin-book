import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class JoinRequestController {
  // ! POST
  request = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (community.type !== 'PRIVATE') {
        return res.status(400).json({
          message: "You can't send a join request for a non private community",
        });
      }
      if (await db.joinRequest.hasRequested(community_id, user_id)) {
        return res
          .status(403)
          .json({ message: 'You have already sent a join request' });
      }
      if (await db.userCommunity.isMember(user_id, community_id)) {
        return res.status(409).json({
          message: 'You are already a member of this community',
        });
      }
      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      await db.joinRequest.request(community_id, user_id);

      return res.status(201).json({
        message: 'Successfully sent join request',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed send join request',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! DELETE
  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (community.type !== 'PRIVATE') {
        return res.status(400).json({
          message:
            "You can't delete a join request for a non private community",
        });
      }
      if (!(await db.joinRequest.hasRequested(community_id, user_id))) {
        return res.status(403).json({ message: 'No join request found' });
      }
      if (await db.userCommunity.isMember(user_id, community_id)) {
        return res.status(409).json({
          message: 'You are already a member of this community',
        });
      }
      if (await db.bannedUsers.isBanned(user_id, community.id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      await db.joinRequest.delete(community_id, user_id);

      return res.status(200).json({
        message: 'Successfully deleted join request',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete join request',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const joinRequestController = new JoinRequestController();
export default joinRequestController;

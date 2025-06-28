import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class ApprovedUserController {
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, approved_username } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      const approvedUser = await db.user.getByUsername(approved_username);
      if (!(await db.user.getById(user_id)) || !approvedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (await db.approvedUser.isApproved(community_id, approvedUser.id)) {
        return res
          .status(400)
          .json({ message: 'This user is already approved' });
      }

      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res.status(403).json({ message: 'You are not a moderator' });
      }

      await db.approvedUser.create(community_id, approvedUser.id);

      return res.status(201).json({
        message: 'Successfully approved user',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to approve user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, approved_username } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      const approvedUser = await db.user.getByUsername(approved_username);
      if (!(await db.user.getById(user_id)) || !approvedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (community.owner_id === approvedUser.id) {
        return res.status(403).json({
          message: 'You can not unnaprove the owner of this community',
        });
      }
      if (!(await db.approvedUser.isApproved(community_id, approvedUser.id))) {
        return res.status(400).json({ message: 'This user is not approved' });
      }

      if (await db.communityModerator.isMod(approvedUser.id, community_id)) {
        if (user_id !== approvedUser.id && community.owner_id !== user_id) {
          return res.status(403).json({
            message: 'You can not unapprove other moderators',
          });
        }
      }
      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        console.log(user_id);
        return res.status(403).json({ message: 'You are not a moderator' });
      }

      await db.approvedUser.delete(
        community_id,
        approvedUser.id,
        community.type === 'PRIVATE',
      );

      return res.status(200).json({
        message: 'Successfully unapproved user',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to unapprove users',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const approvedUserController = new ApprovedUserController();
export default approvedUserController;

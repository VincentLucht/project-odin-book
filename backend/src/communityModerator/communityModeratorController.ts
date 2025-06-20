import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class CommunityModeratorController {
  fetch = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { cmId: community_id, cId: cursorId } = req.query as {
      cmId: string;
      cId: string;
    };

    try {
      const { moderators, pagination } = await db.communityModerator.fetch(
        community_id,
        cursorId,
      );

      return res.status(200).json({
        message: 'Successfully fetched mods from this community',
        moderators,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch mods from this community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  makeMod = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, target_user_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (
        !(await db.user.getById(user_id)) ||
        !(await db.user.getById(target_user_id))
      ) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!(await db.community.doesExistById(community_id))) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }
      if (await db.communityModerator.isMod(target_user_id, community_id)) {
        return res
          .status(403)
          .json({ message: 'This user already is a moderator' });
      }

      await db.communityModerator.makeMod(community_id, target_user_id);

      return res.status(201).json({ message: 'Successfully made user mod' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to make user mod',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  deleteMod = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, target_user_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (
        !(await db.user.getById(user_id)) ||
        !(await db.user.getById(target_user_id))
      ) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!(await db.community.doesExistById(community_id))) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }
      if (!(await db.communityModerator.isMod(target_user_id, community_id))) {
        return res
          .status(403)
          .json({ message: 'This user is not a moderator' });
      }

      await db.communityModerator.deactivateMod(community_id, target_user_id);

      return res
        .status(201)
        .json({ message: 'Successfully removed mod status' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to remove mod status',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const communityModeratorController = new CommunityModeratorController();
export default communityModeratorController;

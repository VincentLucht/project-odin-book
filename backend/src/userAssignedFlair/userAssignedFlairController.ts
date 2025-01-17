import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class UserAssignedFlairController {
  assign = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, community_flair_id } = req.body;

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
          .json({ message: 'Non-members cannot assign user flairs' });
      }
      if (await db.bannedUsers.isBanned(user_id, community_id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      const flair = await db.communityFlair.getById(
        community_id,
        community_flair_id,
      );
      if (!flair) {
        return res.status(404).json({ message: 'Community flair not found' });
      }
      if (!flair.is_assignable_to_users) {
        return res
          .status(400)
          .json({ message: 'Flair is only assignable to posts' });
      }

      const userFlair = await db.userAssignedFlair.getUserFlairInCommunity(
        user_id,
        community_id,
      );
      if (userFlair) {
        if (userFlair.community_flair_id === community_flair_id) {
          return res
            .status(409)
            .json({ message: 'You already use this flair' });
        }

        await db.userAssignedFlair.update(userFlair.id, community_flair_id);
        return res.status(200).json({ message: 'Successfully updated flair' });
      }

      await db.userAssignedFlair.create(user_id, community_flair_id);

      return res.status(201).json({ message: 'Successfully assigned flair' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to assign flair',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, user_assigned_flair_id } = req.body;

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
          .json({ message: 'Non-members cannot assign user flairs' });
      }
      if (await db.bannedUsers.isBanned(user_id, community_id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }

      const userFlair = await db.userAssignedFlair.getById(
        user_assigned_flair_id,
      );
      if (!userFlair) {
        return res.status(404).json({ message: 'Flair not found' });
      }
      if (userFlair.user_id !== user_id) {
        return res
          .status(403)
          .json({ message: 'You can only remove your own flairs' });
      }

      await db.userAssignedFlair.delete(user_assigned_flair_id);

      return res
        .status(200)
        .json({ message: 'Successfully removed user flair' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete flair',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const userAssignedFlairController = new UserAssignedFlairController();
export default userAssignedFlairController;

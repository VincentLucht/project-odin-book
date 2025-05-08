import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class CommunityFlairController {
  // ! GET
  getAllCommunityFlairs = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id } = req.query;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      const community = await db.community.getById(community_id as string);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (community.type === 'PRIVATE') {
        if (!(await db.userCommunity.isMember(user_id, community.id))) {
          return res.status(403).json({
            message: 'You are not a member of this private community',
          });
        }
      }

      const allFlairs = await db.communityFlair.getAllCommunityFlairs(
        community_id as string,
      );

      return res
        .status(201)
        .json({ message: 'Successfully fetched all flairs', allFlairs });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch all flairs',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  getAllPostFlairs = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id } = req.query;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      const community = await db.community.getById(community_id as string);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (community.type === 'PRIVATE') {
        if (!(await db.userCommunity.isMember(user_id, community.id))) {
          return res.status(403).json({
            message: 'You are not a member of this private community',
          });
        }
      }

      const allPostFlairs = await db.communityFlair.getAllPostFlairs(
        community_id as string,
      );

      return res.status(201).json({
        message: 'Successfully fetched all post flairs',
        allPostFlairs,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch all post flairs',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  fetchFlairs = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      cn: community_name,
      cId: cursorId,
      t: type,
    } = req.query as {
      cn: string;
      cId: string;
      t: 'post' | 'user';
    };
    const initialFetch = req.query.initF === 'true';

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getByName(community_name);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      if (!(await db.communityModerator.isMod(user_id, community.id))) {
        return res
          .status(403)
          .json({ message: 'You are not moderator in this community' });
      }

      const { flairs, pagination } = await db.communityFlair.fetch(
        community.id,
        cursorId,
        type,
      );

      let communityFlairCount;
      if (initialFetch) {
        communityFlairCount = await db.communityFlair.getCommunityFlairCount(
          community.id,
        );
      }

      return res.status(200).json({
        message: 'Successfully fetched flairs',
        flairs,
        pagination,
        communityFlairCount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch flairs',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! CREATE
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      community_id,
      name,
      textColor,
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
      if (
        (await db.communityFlair.getCommunityFlairCount(community_id)) >= 700
      ) {
        return res
          .status(422)
          .json({ message: 'Community flair limit of 700 reached' });
      }

      const flair = await db.communityFlair.create(
        community_id,
        name,
        textColor,
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

  // ! UPDATE
  update = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      community_flair_id,
      community_id,
      name,
      textColor,
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
      if (
        !(await db.communityFlair.getById(community_id, community_flair_id))
      ) {
        return res.status(409).json({ message: 'Flair not found' });
      }
      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }

      const flair = await db.communityFlair.update(
        community_flair_id,
        community_id,
        name,
        textColor,
        color,
        is_assignable_to_posts,
        is_assignable_to_users,
        emoji,
      );

      return res
        .status(200)
        .json({ message: 'Successfully updated flair', flair });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to updated flair',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! DELETE
  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, community_flair_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (community.is_post_flair_required) {
        if ((await db.communityFlair.getPostFlairCount(community.id)) === 1) {
          return res.status(409).json({
            message:
              'Cannot delete the last post flair when post flair is required',
          });
        }
      }

      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }

      await db.communityFlair.delete(community_flair_id);

      return res.status(201).json({ message: 'Successfully deleted flair' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete flair',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const communityFlairController = new CommunityFlairController();
export default communityFlairController;

import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import isTimeFrameValid from '@/util/isTimeFrameValid';
import isSortByValid from '@/util/isSortByValid';

import { TimeFrame } from '@/db/managers/util/types';
import { JwtPayload } from 'jsonwebtoken';
import { AuthPayload } from '@/comment/commentController';
import { Pagination } from '@/db/managers/util/types';
import isCommunityTypeValid from '@/community/util/isCommunityTypeValid';

class CommunityController {
  // ! GET
  // TODO: Deprecated??
  fetch = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_name: name } = req.query as {
      community_name: string;
    };

    try {
      const foundCommunity = await db.community.getByName(name);
      if (!foundCommunity) {
        return res.status(404).json({ message: 'Community not found' });
      }

      let requestUserId = undefined;
      if (req.authData) {
        const { id } = req.authData as AuthPayload;
        requestUserId = id;
      }

      if (foundCommunity.type === 'PRIVATE') {
        const { user_id } = getAuthUser(req.authData);
        if (!(await db.user.getById(user_id))) {
          return res.status(404).json({ message: 'User not found' });
        }

        const isMember = await db.userCommunity.isMember(
          user_id,
          foundCommunity.id,
        );
        if (!isMember) {
          return res
            .status(403)
            .json({ message: 'You are not part of this community' });
        }
      }

      const community = await db.community.fetch(
        name,
        foundCommunity.id,
        requestUserId,
      );

      return res.status(200).json({
        message: 'Successfully fetched community',
        community,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create Community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  fetchWithPosts = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_name: name, timeframe, cursorId } = req.params;

    let { sort_by_type } = req.params;
    if (sort_by_type) {
      if (!isSortByValid(sort_by_type)) {
        return res.status(400).json({ message: 'Invalid sort_by_type' });
      }
    } else {
      sort_by_type = 'hot'; // default to hot
    }

    if (sort_by_type === 'top' && timeframe && !isTimeFrameValid(timeframe)) {
      return res.status(400).json({ message: 'Invalid timeframe' });
    }

    const validTimeframe = timeframe as TimeFrame;

    try {
      const foundCommunity = await db.community.getByName(name);
      if (!foundCommunity) {
        return res.status(404).json({ message: 'Community not found' });
      }

      let requestUserId = undefined;
      if (req.authData) {
        const { id } = req.authData as AuthPayload;
        requestUserId = id;
      }

      let isMod = false;
      if (foundCommunity.type === 'PRIVATE') {
        const { user_id } = getAuthUser(req.authData);
        if (!(await db.user.getById(user_id))) {
          return res.status(404).json({ message: 'User not found' });
        }

        const [isModResult, isMember, isApproved] = await Promise.all([
          db.communityModerator.isMod(user_id, foundCommunity.id),
          db.userCommunity.isMember(user_id, foundCommunity.id),
          db.approvedUser.isApproved(user_id, foundCommunity.id),
        ]);

        isMod = isModResult ? true : false;

        if (!isMember && !isApproved) {
          return res
            .status(403)
            .json({ message: 'You are not part of this community' });
        }
      }

      let community;
      let pagination = { nextCursor: undefined, hasMore: false } as Pagination;

      if (sort_by_type === 'new') {
        ({ community, pagination } = await db.community.fetchByNew(
          name,
          foundCommunity.id,
          requestUserId,
          cursorId,
        ));
      } else if (sort_by_type === 'top') {
        ({ community, pagination } = await db.community.fetchByTop(
          name,
          foundCommunity.id,
          validTimeframe,
          requestUserId,
          cursorId,
        ));
      } else if (sort_by_type === 'hot') {
        ({ community } = await db.community.fetchByHot(
          name,
          foundCommunity.id,
          requestUserId,
        ));
        pagination.hasMore = false;
      }

      if (requestUserId && community) {
        await db.recentCommunities.assign(requestUserId, community.id);
      }

      return res.status(200).json({
        message: 'Successfully fetched community',
        community: { ...community, is_moderator: isMod },
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create Community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  searchByName = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_name } = req.params;

    try {
      const communities = await db.community.searchByName(community_name);

      return res.status(200).json({
        message: 'Successfully fetched communities',
        communities,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to search by name',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  getCreationInfo = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_name } = req.params;
    const { get_membership } = req.query;

    try {
      const community = await db.community.getCreationInfo(
        community_name,
        req.authData && get_membership ? (req.authData as JwtPayload).id : null,
      );

      return res.status(200).json({
        message: 'Successfully fetched community',
        community,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch community',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  isNameAvailable = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_name } = req.query;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (await db.community.doesExistByName(community_name as string)) {
        return res.status(403).json({
          message: 'Community Name already in use',
          isNameAvailable: false,
        });
      }

      return res.status(200).json({
        message: 'Name is free to use',
        isNameAvailable: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to acquire availability status',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! POST
  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      name,
      description,
      is_mature,
      allow_basic_user_posts,
      is_post_flair_required,
      type,
      topics,
      profile_picture_url,
      banner_url_desktop,
      banner_url_mobile,
    } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (await db.community.doesExistByName(name)) {
        return res
          .status(409)
          .json({ message: 'Community Name already in use' });
      }

      await db.community.create(
        name,
        description,
        is_mature,
        allow_basic_user_posts,
        is_post_flair_required,
        user_id,
        type,
        topics,
        banner_url_desktop,
        banner_url_mobile,
        profile_picture_url,
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

  // ! MODERATION
  getModInfo = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_name } = req.query as { community_name: string };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const foundCommunity = await db.community.getByName(community_name);
      if (!foundCommunity) {
        return res.status(404).json({ message: 'Community not found' });
      }

      if (!(await db.communityModerator.isMod(user_id, foundCommunity.id))) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }

      const community = await db.community.getModInfo(community_name, user_id);

      return res
        .status(200)
        .json({ message: 'Successfully fetch mod information', community });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to get community mod information',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  editCommunitySettings = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    // TODO: Add more validation here? one for str and bools
    const {
      community_name,
      description,
      community_type,
      is_mature,
      allow_basic_user_posts,
      is_post_flair_required,
      profile_picture_url,
      banner_url_desktop,
      banner_url_mobile,
    } = req.body;

    try {
      if (community_type) {
        const isValid = isCommunityTypeValid(community_type);
        if (!isValid) throw new Error('Invalid community type detected');
      }

      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const foundCommunity = await db.community.getByName(community_name);
      if (!foundCommunity) {
        return res.status(404).json({ message: 'Community not found' });
      }

      if (
        is_post_flair_required &&
        (await db.communityFlair.getPostFlairCount(foundCommunity.id)) === 0
      ) {
        return res.status(409).json({
          message:
            'You have to have at least 1 post flair to enable this setting',
        });
      }

      if (!(await db.communityModerator.isMod(user_id, foundCommunity.id))) {
        return res
          .status(403)
          .json({ message: 'You are not a moderator in this community' });
      }

      await db.community.editCommunitySettings(
        community_name,
        {
          description,
          type: community_type,
          is_mature,
          allow_basic_user_posts,
          is_post_flair_required,
          profile_picture_url,
          banner_url_desktop,
          banner_url_mobile,
        },
        foundCommunity.allow_basic_user_posts,
      );

      return res.status(200).json({ message: 'Successfully edited community' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to edit community info',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const communityController = new CommunityController();
export default communityController;

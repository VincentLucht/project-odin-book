import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import { TimeFrame } from '@/db/managers/util/types';

class UserCommunityController {
  getMembers = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      cmId: communityId,
      cId: cursorId,
      m: mode,
    } = req.query as {
      cmId: string;
      cId: string | undefined;
      m: 'users' | 'moderators' | 'banned' | 'approved' | 'all';
    };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const moderator = await db.communityModerator.getById(
        user_id,
        communityId,
      );
      if (!moderator || !moderator.is_active) {
        return res.status(403).json({ message: 'You are not a moderator ' });
      }

      const { members, pagination } = await db.userCommunity.getMembers(
        communityId,
        cursorId,
        mode,
      );

      return res
        .status(200)
        .json({ message: 'Successfully fetched members', members, pagination });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch members',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  getMembersByName = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      cmId: communityId,
      u: username,
      m: mode,
      t,
    } = req.query as {
      cmId: string;
      u: string;
      m: 'users' | 'moderators' | 'banned' | 'approved';
      t?: string;
    };
    const take = t ? Number(t) : 30;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const moderator = await db.communityModerator.getById(
        user_id,
        communityId,
      );
      if (!moderator || !moderator.is_active) {
        return res.status(403).json({ message: 'You are not a moderator ' });
      }

      const members = await db.userCommunity.getMembersByName(
        communityId,
        username,
        mode,
        take,
      );

      return res.status(200).json({
        message: 'Successfully fetched members',
        members: members ?? [],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch members',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  fetchHomePage = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      sbt: sortByType,
      t: timeframe,
      cId: cursorId,
    } = req.query as {
      sbt: 'new' | 'top';
      t: TimeFrame;
      cId: string;
    };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { homepage, pagination } = await db.userCommunity.fetchHomePageBy(
        user_id,
        sortByType,
        timeframe,
        cursorId,
      );

      return res.status(200).json({
        message: 'Successfully fetched home page',
        posts: homepage,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch home page',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

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
        if (!(await db.approvedUser.isApproved(user_id, community_id))) {
          return res
            .status(403)
            .json({ message: "You can't join a private community" });
        }
      }
      if (await db.bannedUsers.isBanned(user_id, community_id)) {
        return res
          .status(403)
          .json({ message: 'You are banned from this community' });
      }
      const moderator = await db.communityModerator.getById(
        user_id,
        community_id,
      );
      if (moderator && !moderator.is_active) {
        await db.communityModerator.activateMod(community_id, user_id);
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

  getJoinedCommunities = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 15;
      const offset = (page - 1) * limit;

      const joinedCommunities = await db.userCommunity.getJoinedCommunities(
        user_id,
        offset,
        limit,
      );

      const hasMore = joinedCommunities.length >= 15;

      return res.status(201).json({
        message: 'Successfully fetched joined communities',
        joinedCommunities,
        hasMore,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch joined communities',
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
      if (await db.community.isOwner(user_id, community_id)) {
        return res
          .status(400)
          .json({ message: 'As the owner, you can not leave a community' });
      }

      const isMod = await db.communityModerator.isMod(user_id, community_id);
      if (isMod) {
        await Promise.all([
          db.communityModerator.deactivateMod(community_id, user_id),
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

  ban = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      community_id,
      username: banned_username,
      ban_duration,
      ban_reason,
    } = req.body;

    try {
      const { user_id, username } = getAuthUser(req.authData);
      if (username === banned_username) {
        return res.status(400).json({ message: 'You can not ban yourself' });
      }
      const bannedUser = await db.user.getByUsername(banned_username);
      if (!(await db.user.getById(user_id)) || !bannedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      if (!(await db.userCommunity.isMember(bannedUser.id, community_id))) {
        return res
          .status(400)
          .json({ message: 'User is not a member of this community' });
      }
      if (await db.bannedUsers.isBanned(bannedUser.id, community_id)) {
        return res.status(409).json({ message: 'This user is already banned' });
      }

      if (await db.communityModerator.isMod(bannedUser.id, community_id)) {
        if (!(await db.community.isOwner(user_id, community_id))) {
          return res.status(403).json({
            message:
              'Only the owner of this community can remove other moderators',
          });
        }

        await db.communityModerator.delete(community_id, bannedUser.id);
      }

      await db.userCommunity.leave(bannedUser.id, community_id);

      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res.status(403).json({ message: 'You are not a moderator' });
      }

      await db.bannedUsers.ban(
        bannedUser.id,
        community_id,
        ban_duration,
        ban_reason,
      );
      await db.notification.send(
        'community',
        community_id,
        bannedUser.id,
        'MODMESSAGE',
        `You have been banned from r/${community.name}`,
        ban_reason ?? 'No ban reason was provided.',
      );

      return res.status(200).json({ message: 'Successfully banned user' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to ban user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  unban = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, username: banned_username } = req.body;

    try {
      const { user_id, username } = getAuthUser(req.authData);
      if (username === banned_username) {
        return res.status(400).json({ message: 'You can not unban yourself' });
      }
      const bannedUser = await db.user.getByUsername(banned_username);
      if (!(await db.user.getById(user_id)) || !bannedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (!(await db.bannedUsers.isBanned(bannedUser.id, community_id))) {
        return res.status(400).json({ message: 'This user is not banned' });
      }

      if (!(await db.communityModerator.isMod(user_id, community_id))) {
        return res.status(403).json({ message: 'You are not a moderator' });
      }

      if (community.type === 'PRIVATE') {
        await db.userCommunity.join(bannedUser.id, community_id);
      }

      await db.bannedUsers.unban(bannedUser.id, community_id);
      await db.notification.send(
        'community',
        community_id,
        bannedUser.id,
        'MODMESSAGE',
        `You have been unbanned from r/${community.name}`,
        'The moderators of this community unbanned you. If you were a moderator, or a member, your role was NOT restored.',
      );

      return res.status(200).json({ message: 'Successfully unbanned user' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to unban user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const userCommunityController = new UserCommunityController();
export default userCommunityController;

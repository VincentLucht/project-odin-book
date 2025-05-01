import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class ReportController {
  // ! GET
  fetch = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      cn: community_name,
      t: type,
      s: status,
      sbt: sortByType,
      ls: lastScore,
      ld: lastDate,
      cId: cursorId,
    } = req.query as {
      cn: string;
      t: 'all' | 'posts' | 'comments';
      s: 'pending' | 'moderated' | 'approved' | 'dismissed';
      sbt: 'new' | 'top';
      ls: string;
      ld: string;
      cId: string;
    };

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

      const { reports, pagination } = await db.report.getBy(
        community.id,
        type,
        sortByType,
        status,
        { lastScore: Number(lastScore), lastDate, lastId: cursorId },
      );

      return res.status(200).json({
        message: 'Successfully fetched reports',
        reports,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch reports',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! CREATE
  report = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { type, item_id, subject, reason } = req.body;

    const typeString =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      let item;
      if (type === 'POST') {
        item = await db.post.getById(item_id);
      } else if (type === 'COMMENT') {
        item = await db.comment.getByIdAndCommunityId(item_id);
      }

      if (!item) {
        return res.status(404).json({
          message: `${typeString} not found`,
        });
      }

      if (await db.report.alreadyReported(type, user_id, item_id)) {
        return res
          .status(403)
          .json({ message: `You already reported this ${typeString}` });
      }

      const report = await db.report.report(
        type,
        user_id,
        item_id,
        item.community_id,
        subject,
        reason,
      );

      return res
        .status(201)
        .json({ message: `Successfully reported ${typeString}`, report });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: `Failed to report ${typeString}`,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! UPDATE
  updateMessage = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { modmail_id, archived, replied } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const modmail = await db.modMail.getById(modmail_id);
      if (!modmail) {
        return res.status(404).json({ message: 'Mod mail was not found' });
      }
      const community = await db.community.getById(modmail.community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
      if (!(await db.communityModerator.isMod(user_id, community.id))) {
        return res
          .status(403)
          .json({ message: 'You are not moderator in this community' });
      }

      await db.modMail.update(modmail_id, { archived, replied });

      return res.status(201).json({ message: 'Successfully updated mod mail' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to update mod mail',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const reportController = new ReportController();
export default reportController;

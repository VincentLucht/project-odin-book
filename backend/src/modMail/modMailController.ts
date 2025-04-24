import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class ModMailController {
  // ! GET
  fetch = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { cn: community_name, cId: cursorId } = req.query as {
      cn: string;
      cId: string;
    };
    const getArchived = req.query.gA === 'true';
    const getReplied = req.query.gR === 'true';
    const onlyArchived = req.query.oA === 'true';

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

      const { modmail, pagination } = await db.modMail.fetch(
        community.id,
        cursorId,
        onlyArchived,
        getArchived,
        getReplied,
      );

      return res.status(200).json({
        message: 'Successfully fetched mod mail',
        modmail,
        pagination,
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
  sendMessage = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { community_id, subject, message } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const community = await db.community.getById(community_id);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }

      await db.modMail.sendMessage(community_id, user_id, subject, message);

      return res.status(201).json({ message: 'Successfully sent message' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  replyToMessage = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { subject, message, modmail_id } = req.body;

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

      await db.modMail.update(modmail_id, { replied: true });
      await db.notifications.sendNotification(
        'community',
        modmail.community_id,
        modmail.sender_id,
        'MODMAILREPLY',
        subject,
        message,
      );

      return res
        .status(201)
        .json({ message: 'Successfully replied to mod mail' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to reply to mod mail',
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

const modMailController = new ModMailController();
export default modMailController;

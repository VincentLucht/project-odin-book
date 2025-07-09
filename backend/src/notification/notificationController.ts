import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class NotificationController {
  // ! GET
  fetchBy = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { sbt: sortByType, cId: cursorId } = req.query as {
      sbt: 'all' | 'read' | 'unread';
      cId: string | undefined;
    };
    const includeHidden = req.query.iH === 'true';

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { notifications, pagination } = await db.notification.fetchBy(
        user_id,
        sortByType,
        includeHidden,
        cursorId,
      );

      return res.status(200).json({
        message: 'Successfully fetched all notifications',
        notifications,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch all notifications',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  hasUnreadNotifications = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hasUnreadNotifications = await db.notification.hasUnread(user_id);

      return res.status(200).json({ hasUnreadNotifications });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to determine notification amount',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ! UPDATE
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      await db.notification.markAllAsRead(user_id);

      return res
        .status(200)
        .json({ message: 'Successfully marked all notifications as read' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to mark all notifications as read',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  openAll = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      await db.notification.openAll(user_id);

      return res
        .status(200)
        .json({ message: 'Successfully opened all notifications' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to open all notifications',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  read = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { notification_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const notification = await db.notification.getById(notification_id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      if (notification.receiver_id !== user_id) {
        return res.status(403).json({ message: 'Incorrect user ID' });
      }
      if (notification.read_at) {
        return res
          .status(200)
          .json({ message: 'This notification is already read' });
      }

      await db.notification.read(user_id, notification_id);

      return res
        .status(200)
        .json({ message: 'Successfully read notification' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to read notification',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  hide = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { notification_id } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const notification = await db.notification.getById(notification_id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      if (notification.receiver_id !== user_id) {
        return res.status(403).json({ message: 'Incorrect user ID' });
      }

      await db.notification.hide(
        user_id,
        notification_id,
        !notification.is_hidden,
      );

      return res
        .status(200)
        .json({ message: 'Successfully read notification' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to read notification',
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

const notificationController = new NotificationController();
export default notificationController;

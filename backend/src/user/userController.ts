import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import bcrypt from 'bcrypt';

import { AuthPayload } from '@/comment/commentController';

class UserController {
  get = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      u: username,
      sbt: sortByType,
      tf: typeFilter,
      cId: cursorId,
      cLs: cursorLastScore,
      cLd: cursorLastDate,
    } = req.query as {
      u: string;
      sbt: 'new' | 'top';
      tf: 'both' | 'posts' | 'comments';
      cId: string | undefined;
      cLs: string | undefined | null;
      cLd: string | undefined | null;
    };
    const initialFetch = req.query.initF === 'true';

    try {
      const user = await db.user.getByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let requestUserId = undefined;
      if (req.authData) {
        const { id } = req.authData as AuthPayload;
        requestUserId = id;
      }

      const {
        user: fetchedUser,
        history,
        pagination,
      } = await db.user.getByUsernameAndHistory(
        requestUserId,
        user.id,
        sortByType,
        {
          lastId: cursorId,
          lastScore: Number(cursorLastScore),
          lastDate: cursorLastDate ?? '',
        },
        typeFilter,
        initialFetch,
      );

      let chatProperties = {};
      if (initialFetch) {
        if (user.id === requestUserId) {
          chatProperties = {
            canCreate: false,
            existsOneOnOne: false,
            chatId: undefined,
          };
        } else {
          const checks = [
            db.chat.canCreateChat(user.id),
            requestUserId
              ? db.chat.doesExist_1on1(user.id, requestUserId)
              : Promise.resolve(null),
          ];

          const [canCreate, oneOnOneResult] = await Promise.all(checks);
          const chatExists =
            oneOnOneResult && typeof oneOnOneResult === 'object';
          chatProperties = {
            canCreate: !!canCreate,
            existsOneOnOne: !!oneOnOneResult,
            chatId: chatExists ? oneOnOneResult.chat_id : null,
          };
        }
      }

      return res.status(200).json({
        message: 'Found user',
        user: { ...fetchedUser, chatProperties },
        history,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  fetchMany = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { u: username } = req.query as { u: string };

    try {
      const { user_id } = getAuthUser(req.authData);
      const user = await db.user.getById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const users = await db.user.getByUsernameMany(username, user_id);

      return res.status(200).json({
        message: 'Results',
        users: users ?? [],
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  getSettings = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      const user = await db.user.getById(user_id);
      if (!user || user.deleted_at) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userSettings = await db.user.getSettings(user_id);

      return res.status(200).json({
        message: 'Found user settings',
        data: userSettings,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  editSettings = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const {
      email,
      display_name,
      password,
      description,
      cake_day,
      profile_picture_url,
      // Notification settings
      community_enabled,
      posts_enabled,
      comments_enabled,
      mods_enabled,
      chats_enabled,
      follows_enabled,
    } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      const user = await db.user.getById(user_id);
      if (!user || user.deleted_at) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isOnlyNotificationsUpdate =
        email === undefined &&
        display_name === undefined &&
        description === undefined &&
        cake_day === undefined &&
        profile_picture_url === undefined;
      if (!isOnlyNotificationsUpdate) {
        if (!(await bcrypt.compare(password ?? '', user.password))) {
          return res.status(400).json({ message: 'Incorrect password' });
        }
      }

      const userData = {
        email,
        display_name,
        password,
        description,
        cake_day,
        profile_picture_url,
      };
      const settingsData = {
        community_enabled,
        posts_enabled,
        comments_enabled,
        mods_enabled,
        chats_enabled,
        follows_enabled,
      };

      await db.user.edit(user_id, userData, settingsData);

      return res.status(200).json({
        message: 'Successfully edited settings',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed edit settings',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      const user = await db.user.getById(user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user?.deleted_at) {
        return res.status(400).json({ message: 'User is already deleted' });
      }

      if (user.username === 'guest' || user.username === 'guest_admin') {
        return res
          .status(403)
          .json({ message: 'Please do not delete the demo users :(' });
      }

      await db.user.delete(user_id);

      return res.status(200).json({ message: 'Successfully deleted user' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const userController = new UserController();
export default userController;

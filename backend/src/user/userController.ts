import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import bcrypt from 'bcrypt';

import { SortByUser } from '@/db/managers/util/types';
import { AuthPayload } from '@/comment/commentController';

class UserController {
  get = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const username = req.query.username as string;
    const sort_by = req.query.sort_by as SortByUser;
    const page = parseInt(req.query.page as string, 10);

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

      const userAndHistory = await db.user.getByUsernameAndHistory(
        requestUserId,
        user.username,
        sort_by,
        page,
      );

      return res.status(200).json({
        message: 'Found user',
        user: userAndHistory || { ...user, posts: [], comments: [] },
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

      const settings = await db.user.getSettings(user_id);
      console.log(settings);

      return res.status(200).json({
        message: 'Found user settings',
        settings,
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
    } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      const user = await db.user.getById(user_id);
      if (!user || user.deleted_at) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      await db.user.edit(user_id, {
        email,
        display_name,
        password,
        description,
        cake_day,
        profile_picture_url,
      });

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

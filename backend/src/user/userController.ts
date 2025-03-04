import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';
import { SortByUser } from '@/db/managers/util/types';

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

      const userAndHistory = await db.user.getByUsernameAndHistory(
        user.id,
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

  delete = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'Successfully deleted user' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const userController = new UserController();
export default userController;

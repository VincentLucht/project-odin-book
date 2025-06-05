import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class MessageController {
  fetch = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { chatId, cId: cursorId } = req.query as {
      chatId: string;
      cId: string | undefined;
    };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { messages, pagination } = await db.message.fetch(chatId, cursorId);

      return res.status(200).json({
        message: 'Successfully fetched messages',
        messages,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch messages',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { chat_id, content } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!(await db.userChat.isMemberById(chat_id, user_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a member of this chat' });
      }

      const sentMessage = await db.message.send(chat_id, user_id, content);

      return res.status(201).json({
        message: 'Successfully sent message',
        sentMessage,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to send message',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const messageController = new MessageController();
export default messageController;

import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';
import getAuthUser from '@/util/getAuthUser';

class ChatController {
  fetchAll = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { cId: cursorId } = req.query as {
      cId: string | undefined;
    };

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const chats = await db.userChat.fetch(user_id, cursorId);

      return res.status(200).json({
        message: 'Successfully fetched chat overviews',
        chats,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch chats overviews',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  fetch = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { chat_id } = req.query as {
      chat_id: string;
    };

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

      const { chat, pagination } = await db.chat.fetch(chat_id);

      return res.status(200).json({
        message: 'Successfully fetched chat',
        chat,
        pagination,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch chat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  getUnread = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hasNewChatMessages = await db.userChat.hasNewMessages(user_id);

      return res.status(200).json({
        message: 'Successfully fetched unread message status',
        hasNewChatMessages,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch unread message status',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { user2_username } = req.body;

    try {
      const { user_id, username } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user2 = await db.user.getByUsername(user2_username);
      if (!user2) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (username === user2.username) {
        return res
          .status(409)
          .json({ message: 'You can not create a chat with yourself' });
      }

      if (await db.chat.doesExist_1on1(user_id, user2.id)) {
        return res.status(409).json({ message: 'Chat already exists' });
      }
      if (!(await db.chat.canCreateChat(user2.id))) {
        return res
          .status(403)
          .json({ message: 'This user disabled chat requests' });
      }

      const chat = await db.chat.create(user_id, user2.id, '', false, '', '');

      return res.status(201).json({
        message: 'Successfully created chat',
        chat,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create chat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  read = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { chat_id } = req.body;

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

      await db.userChat.read(user_id, chat_id);

      return res.status(200).json({
        message: 'Successfully read chat',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to read chat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  mute = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { chat_id, is_muted } = req.body;

    try {
      const { user_id } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!(await db.userChat.isMemberById(user_id, chat_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a member of this chat' });
      }

      await db.userChat.muteChat(chat_id, user_id, is_muted);

      return res.status(200).json({
        message: 'Successfully muted chat',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to mute chat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  leave = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    const { chat_id } = req.body;

    try {
      const { user_id, username } = getAuthUser(req.authData);
      if (!(await db.user.getById(user_id))) {
        return res.status(404).json({ message: 'User not found' });
      }

      const chat = await db.chat.getById(chat_id);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found' });
      }
      if (!(await db.userChat.isMemberById(chat_id, user_id))) {
        return res
          .status(403)
          .json({ message: 'You are not a member of this chat' });
      }

      const remainingMembers = await db.userChat.leave(
        chat_id,
        user_id,
        username,
        chat.is_group_chat,
      );
      if (remainingMembers > 0) {
        await db.message.send(
          chat_id,
          'system_id',
          `u/${username} left the chat`,
        );
      }

      return res.status(200).json({
        message: 'Successfully left chat',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to leave chat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const chatController = new ChatController();
export default chatController;

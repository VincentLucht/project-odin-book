import express from 'express';
import token from '@/auth/token';
import messageValidator from '@/chats/message/messageValidator';
import messageController from '@/chats/message/messageController';

// /chat/message
const messageRouter = express.Router();

messageRouter.get(
  '', // ? chat_id=&cId=cursor_id
  token.authenticate,
  messageValidator.fetchRules(),
  messageController.fetch,
);

messageRouter.post(
  '',
  token.authenticate,
  messageValidator.creationRules(),
  messageController.create,
);

export default messageRouter;

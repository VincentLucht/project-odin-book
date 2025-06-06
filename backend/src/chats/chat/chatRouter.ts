import express from 'express';
import token from '@/auth/token';
import chatValidator from '@/chats/chat/chatValidator';
import chatController from '@/chats/chat/chatController';

// /chat
const chatRouter = express.Router();

chatRouter.get('/all', token.authenticate, chatController.fetchAll);

chatRouter.get(
  '',
  token.authenticate,
  chatValidator.fetchRules(),
  chatController.fetch,
);

chatRouter.get('/unread', token.authenticate, chatController.getUnread);

chatRouter.post(
  '',
  token.authenticate,
  chatValidator.creationRules(),
  chatController.create,
);

chatRouter.post(
  '/read',
  token.authenticate,
  chatValidator.readRules(),
  chatController.read,
);

chatRouter.put(
  '/mute',
  token.authenticate,
  chatValidator.muteRules(),
  chatController.mute,
);

chatRouter.delete(
  '',
  token.authenticate,
  chatValidator.leaveRules(),
  chatController.leave,
);

export default chatRouter;

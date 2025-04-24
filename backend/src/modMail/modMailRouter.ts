import express from 'express';
import token from '@/auth/token';
import modMailValidator from '@/modMail/modMailValidator';
import modMailController from '@/modMail/modMailController';

// /modmail
const modMailRouter = express.Router();

modMailRouter.get(
  '', // ?cn=community_name&cId=cursor_id
  token.authenticate,
  modMailValidator.fetchRules(),
  modMailController.fetch,
);

modMailRouter.post(
  '',
  token.authenticate,
  modMailValidator.sendMessageRules(),
  modMailController.sendMessage,
);

modMailRouter.post(
  '/reply',
  token.authenticate,
  modMailValidator.replyToMessageRules(),
  modMailController.replyToMessage,
);

modMailRouter.put(
  '',
  token.authenticate,
  modMailValidator.updateMessageRules(),
  modMailController.updateMessage,
);

export default modMailRouter;

import express from 'express';
import token from '@/auth/token';
import commentModerationValidator from '@/commentModeration/commentModerationValidator';
import commentModerationController from '@/commentModeration/commentModerationController';

// /community/mod/comment
const commentModerationRouter = express.Router();

commentModerationRouter.post(
  '',
  token.authenticate,
  commentModerationValidator.moderationRules(),
  commentModerationController.moderateComment,
);

export default commentModerationRouter;

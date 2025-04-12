import express from 'express';
import token from '@/auth/token';
import postModerationValidator from '@/postModeration/postModerationValidator';
import postModerationController from '@/postModeration/postModerationController';

// /community/mod/post
const postModerationRouter = express.Router();

postModerationRouter.post(
  '',
  token.authenticate,
  postModerationValidator.moderationRules(),
  postModerationController.moderatePost,
);

postModerationRouter.put(
  '',
  token.authenticate,
  postModerationValidator.updatePostAsModeratorRules(),
  postModerationController.updatePostAsModerator,
);

postModerationRouter.delete('/user', token.authenticate);

postModerationRouter.get('/post', token.authenticate);

export default postModerationRouter;

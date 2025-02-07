import express from 'express';
import token from '@/auth/token';
import commentValidator from '@/comment/commentValidator';
import commentController from '@/comment/commentController';

// /comment
const commentRouter = express.Router();

commentRouter.get(
  '/:post_id',
  token.authenticateOptional,
  commentValidator.fetchRules(),
  commentController.get,
);

commentRouter.post(
  '',
  token.authenticate,
  commentValidator.creationRules(),
  commentController.create,
);

commentRouter.delete(
  '',
  token.authenticate,
  commentValidator.deletionRules(),
  commentController.delete,
);

export default commentRouter;

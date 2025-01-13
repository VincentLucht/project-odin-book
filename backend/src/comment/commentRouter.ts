import express from 'express';
import token from '@/auth/token';
import commentValidator from '@/comment/commentValidator';
import commentController from '@/comment/commentController';

// /community/post/comment
const commentRouter = express.Router();

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

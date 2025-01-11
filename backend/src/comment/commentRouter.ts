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

export default commentRouter;

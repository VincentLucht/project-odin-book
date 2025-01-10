import express from 'express';
import token from '@/auth/token';
import postValidator from '@/post/postValidator';
import postController from '@/post/postController';

// /community
const postRouter = express.Router();

postRouter.post(
  '/post',
  token.authenticate,
  postValidator.creationRules(),
  postController.create,
);

postRouter.put(
  '/post',
  token.authenticate,
  postValidator.editRules(),
  postController.edit,
);

export default postRouter;

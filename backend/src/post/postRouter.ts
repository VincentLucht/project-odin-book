import express from 'express';
import token from '@/auth/token';
import postValidator from '@/post/postValidator';
import postController from '@/post/postController';

// /post
const postRouter = express.Router();

postRouter.get(
  '/:post_id',
  token.authenticateOptional,
  postValidator.fetchRules(),
  postController.get,
);

postRouter.post(
  '',
  token.authenticate,
  postValidator.creationRules(),
  postController.create,
);

postRouter.put(
  '',
  token.authenticate,
  postValidator.editRules(),
  postController.edit,
);

postRouter.delete(
  '',
  token.authenticate,
  postValidator.deleteRules(),
  postController.delete,
);

export default postRouter;

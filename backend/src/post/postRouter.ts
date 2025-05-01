import express from 'express';
import token from '@/auth/token';
import postValidator from '@/post/postValidator';
import postController from '@/post/postController';

// /post
const postRouter = express.Router();

postRouter.get(
  '',
  token.authenticateOptional,
  postValidator.getByRules(),
  postController.getBy,
);

postRouter.get(
  '/popular',
  token.authenticateOptional,
  postValidator.getPopularRules(),
  postController.getPopular,
);

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

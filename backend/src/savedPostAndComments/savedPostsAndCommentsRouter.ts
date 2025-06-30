import express from 'express';
import token from '@/auth/token';
import savedPostsAndCommentsController from '@/savedPostAndComments/savedPostsAndCommentsController';
import savedPostsAndCommentsValidator from '@/savedPostAndComments/savedPostsAndCommentsValidator';

const savedRouter = express.Router();
const savedValidator = savedPostsAndCommentsValidator;
const savedController = savedPostsAndCommentsController;

// Posts
savedRouter.post(
  '/post/save',
  token.authenticate,
  savedValidator.savePostRules(),
  savedController.savePost,
);

savedRouter.delete(
  '/post/save',
  token.authenticate,
  savedValidator.unsavePostRules(),
  savedController.unsavePost,
);

// Comments
savedRouter.post(
  '/comment/save',
  token.authenticate,
  savedValidator.saveCommentRules(),
  savedController.saveComment,
);

savedRouter.delete(
  '/comment/save',
  token.authenticate,
  savedValidator.unsaveCommentRules(),
  savedController.unsaveComment,
);

export default savedRouter;

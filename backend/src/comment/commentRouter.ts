import express from 'express';
import token from '@/auth/token';
import commentValidator from '@/comment/commentValidator';
import commentController from '@/comment/commentController';

// /comment
const commentRouter = express.Router();

commentRouter.get(
  '', // ? pId=postId&sbt=sortByType&cId=cursorId
  token.authenticateOptional,
  commentValidator.fetchRules(),
  commentController.get,
);

commentRouter.get(
  '/:post_id/replies/:parent_comment_id',
  token.authenticateOptional,
  commentValidator.fetchMoreRules(),
  commentController.getMoreReplies,
);

commentRouter.post(
  '',
  token.authenticate,
  commentValidator.creationRules(),
  commentController.create,
);

commentRouter.put(
  '',
  token.authenticate,
  commentValidator.updateRules(),
  commentController.update,
);

commentRouter.delete(
  '',
  token.authenticate,
  commentValidator.deletionRules(),
  commentController.delete,
);

export default commentRouter;

import express from 'express';
import token from '@/auth/token';
import commentVoteValidator from '@/commentVote/commentVoteValidator';
import commentVoteController from '@/commentVote/commentVoteController';

// /community/post/comment/vote
const commentVoteRouter = express.Router();

commentVoteRouter.post(
  '',
  token.authenticate,
  commentVoteValidator.creationRules(),
  commentVoteController.vote,
);

commentVoteRouter.delete(
  '',
  token.authenticate,
  commentVoteValidator.deletionRules(),
  commentVoteController.delete,
);

export default commentVoteRouter;

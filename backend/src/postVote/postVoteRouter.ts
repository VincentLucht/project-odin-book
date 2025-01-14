import express from 'express';
import token from '@/auth/token';
import postVoteValidator from '@/postVote/postVoteValidator';
import postVoteController from '@/postVote/postVoteController';

// /community/post/vote
const postVoteRouter = express.Router();

postVoteRouter.post(
  '',
  token.authenticate,
  postVoteValidator.voteRules(),
  postVoteController.vote,
);

export default postVoteRouter;

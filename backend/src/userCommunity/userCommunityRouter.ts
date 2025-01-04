import express from 'express';
import token from '@/auth/token';
import userCommunityValidator from '@/userCommunity/userCommunityValidator';
import userCommunityController from '@/userCommunity/userCommunityController';

// /community
const userCommunityRouter = express.Router();

userCommunityRouter.post(
  '/join',
  token.authenticate,
  userCommunityValidator.joinRules(),
  userCommunityController.join,
);

export default userCommunityRouter;

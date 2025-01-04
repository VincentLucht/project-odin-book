import express from 'express';
import token from '@/auth/token';
import communityValidator from '@/community/communityValidator';
import communityController from '@/community/communityController';

// /community is base path
const communityRouter = express.Router();

communityRouter.post(
  '',
  token.authenticate,
  communityValidator.creationRules(),
  communityController.create,
);

export default communityRouter;

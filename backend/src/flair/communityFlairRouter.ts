import express from 'express';
import token from '@/auth/token';
import communityFlairValidator from '@/flair/communityFlairValidator';
import communityFlairController from '@/flair/communityFlairController';

// /community/flair
const communityFlairRouter = express.Router();

communityFlairRouter.post(
  '',
  token.authenticate,
  communityFlairValidator.creationRules(),
  communityFlairController.create,
);

export default communityFlairRouter;

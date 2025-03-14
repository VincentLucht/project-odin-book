import express from 'express';
import token from '@/auth/token';
import communityFlairValidator from '@/communityFlair/communityFlairValidator';
import communityFlairController from '@/communityFlair/communityFlairController';

// /community/flair
const communityFlairRouter = express.Router();

communityFlairRouter.get(
  '/all',
  token.authenticate,
  communityFlairValidator.getAllCommunityFlairsRules(),
  communityFlairController.getAllCommunityFlairs,
);

communityFlairRouter.get(
  '/post',
  token.authenticate,
  communityFlairValidator.getAllPostFlairsRules(),
  communityFlairController.getAllPostFlairs,
);

communityFlairRouter.post(
  '',
  token.authenticate,
  communityFlairValidator.creationRules(),
  communityFlairController.create,
);

export default communityFlairRouter;

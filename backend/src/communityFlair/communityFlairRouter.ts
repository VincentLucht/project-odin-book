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

// communityFlairRouter.get(
//   '/post',
//   token.authenticate,
//   communityFlairValidator.getAllPostFlairsRules(),
//   communityFlairController.getAllPostFlairs,
// );

communityFlairRouter.get(
  '', // ?cn=community_name&cId=cursor_id&t=type&initF=is_initial_fetch
  token.authenticate,
  communityFlairValidator.fetchRules(),
  communityFlairController.fetchFlairs,
);

communityFlairRouter.post(
  '',
  token.authenticate,
  communityFlairValidator.creationRules(),
  communityFlairController.create,
);

communityFlairRouter.put(
  '',
  token.authenticate,
  communityFlairValidator.updateRules(),
  communityFlairController.update,
);

communityFlairRouter.delete(
  '',
  token.authenticate,
  communityFlairValidator.deletionRules(),
  communityFlairController.delete,
);

export default communityFlairRouter;

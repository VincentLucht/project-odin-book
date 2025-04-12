import express from 'express';
import token from '@/auth/token';
import communityModeratorValidator from '@/communityModerator/communityModeratorValidator';
import communityModeratorController from '@/communityModerator/communityModeratorController';

// /community/mod
const communityModeratorRouter = express.Router();

communityModeratorRouter.post(
  '/user',
  token.authenticate,
  communityModeratorValidator.makeModRules(),
  communityModeratorController.makeMod,
);

communityModeratorRouter.delete(
  '/user',
  token.authenticate,
  communityModeratorValidator.makeModRules(),
  communityModeratorController.deleteMod,
);

communityModeratorRouter.get('/post', token.authenticate);

export default communityModeratorRouter;

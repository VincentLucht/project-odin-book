import express from 'express';
import token from '@/auth/token';
import communityValidator from '@/community/communityValidator';
import communityController from '@/community/communityController';

const communityRouter = express.Router();

communityRouter.get(
  '/community/is-name-available',
  token.authenticate,
  communityValidator.isNameAvailableRules(),
  communityController.isNameAvailable,
);

communityRouter.get(
  '/community/:community_name/search',
  communityValidator.searchByNameRules(),
  communityController.searchByName,
);

communityRouter.get(
  '/community/:community_name/creation-info',
  token.authenticateOptional,
  communityValidator.getCreationInfoRules(),
  communityController.getCreationInfo,
);

communityRouter.get(
  '/r/:community_name/:sort_by_type?/:timeframe?',
  token.authenticateOptional,
  communityValidator.fetchRules(),
  communityController.fetchWithPosts,
);

communityRouter.post(
  '/community',
  token.authenticate,
  communityValidator.creationRules(),
  communityController.create,
);

export default communityRouter;

import express from 'express';
import token from '@/auth/token';
import recentCommunitiesController from '@/recentCommunities/recentCommunitiesController';

// /user/recent-communities
const recentCommunitiesRouter = express.Router();

recentCommunitiesRouter.get(
  '',
  token.authenticate,
  recentCommunitiesController.get,
);

export default recentCommunitiesRouter;

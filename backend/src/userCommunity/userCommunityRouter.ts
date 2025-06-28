import express from 'express';
import token from '@/auth/token';
import userCommunityValidator from '@/userCommunity/userCommunityValidator';
import userCommunityController from '@/userCommunity/userCommunityController';

// /community
const userCommunityRouter = express.Router();

userCommunityRouter.get(
  '/members', // ?cmId=community_id&cId=cursor_id
  token.authenticate,
  userCommunityValidator.getMembersRules(),
  userCommunityController.getMembers,
);

userCommunityRouter.get(
  '/members/search', // ?cmId=community_id&u=username
  token.authenticate,
  userCommunityValidator.getMembersByNameRules(),
  userCommunityController.getMembersByName,
);

userCommunityRouter.get(
  '/homepage',
  token.authenticate,
  userCommunityController.fetchHomePage,
);

userCommunityRouter.get(
  '/joined-communities',
  token.authenticate,
  userCommunityController.getJoinedCommunities,
);

userCommunityRouter.post(
  '/join',
  token.authenticate,
  userCommunityValidator.joinRules(),
  userCommunityController.join,
);

userCommunityRouter.post(
  '/members/ban',
  token.authenticate,
  userCommunityValidator.banRules(),
  userCommunityController.ban,
);

userCommunityRouter.delete(
  '/members/unban',
  token.authenticate,
  userCommunityValidator.unbanRules(),
  userCommunityController.unban,
);

userCommunityRouter.delete(
  '/leave',
  token.authenticate,
  userCommunityValidator.leaveRules(),
  userCommunityController.leave,
);

export default userCommunityRouter;

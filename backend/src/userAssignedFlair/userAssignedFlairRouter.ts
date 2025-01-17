import express from 'express';
import token from '@/auth/token';
import userAssignedFlairValidator from '@/userAssignedFlair/userAssignedFlairValidator';
import userAssignedFlairController from '@/userAssignedFlair/userAssignedFlairController';

// /community/user/flair
const userAssignedFlairRouter = express.Router();

userAssignedFlairRouter.post(
  '',
  token.authenticate,
  userAssignedFlairValidator.assignRules(),
  userAssignedFlairController.assign,
);

userAssignedFlairRouter.delete(
  '',
  token.authenticate,
  userAssignedFlairValidator.deletionRules(),
  userAssignedFlairController.delete,
);

export default userAssignedFlairRouter;

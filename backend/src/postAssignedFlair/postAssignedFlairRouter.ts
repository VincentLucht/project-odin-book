import express from 'express';
import token from '@/auth/token';
import postAssignedFlairValidator from '@/postAssignedFlair/postAssignedFlairValidator';
import postAssignedFlairController from '@/postAssignedFlair/postAssignedFlairController';

// /community/post/flair
const postAssignedFlairRouter = express.Router();

postAssignedFlairRouter.post(
  '',
  token.authenticate,
  postAssignedFlairValidator.assignRules(),
  postAssignedFlairController.assign,
);

postAssignedFlairRouter.delete(
  '',
  token.authenticate,
  postAssignedFlairValidator.deletionRules(),
  postAssignedFlairController.delete,
);

export default postAssignedFlairRouter;

import express from 'express';
import token from '@/auth/token';
import joinRequestValidator from '@/joinRequest/joinRequestValidator';
import joinRequestController from '@/joinRequest/joinRequestController';

// /community/join-request
const joinRequestRouter = express.Router();

joinRequestRouter.post(
  '',
  token.authenticate,
  joinRequestValidator.requestRules(),
  joinRequestController.request,
);

joinRequestRouter.delete(
  '',
  token.authenticate,
  joinRequestValidator.deletionRules(),
  joinRequestController.delete,
);

export default joinRequestRouter;

import express from 'express';
import token from '@/auth/token';
import approvedUserValidator from '@/approvedUser/approvedUserValidator';
import approvedUserController from '@/approvedUser/approvedUserController';

// /community/user/approved
const approvedUsersRouter = express.Router();

approvedUsersRouter.post(
  '',
  token.authenticate,
  approvedUserValidator.createRules(),
  approvedUserController.create,
);

approvedUsersRouter.delete(
  '',
  token.authenticate,
  approvedUserValidator.deleteRules(),
  approvedUserController.delete,
);

export default approvedUsersRouter;

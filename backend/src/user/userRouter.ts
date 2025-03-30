import express from 'express';
import token from '@/auth/token';
import userValidator from '@/user/userValidator';
import userController from '@/user/userController';

// /user
const userRouter = express.Router();

userRouter.get(
  '',
  token.authenticateOptional,
  userValidator.fetchRules(),
  userController.get,
);

userRouter.get('/settings', token.authenticate, userController.getSettings);

userRouter.post('/settings', token.authenticate, userController.editSettings);

userRouter.delete('', token.authenticate, userController.delete);

export default userRouter;

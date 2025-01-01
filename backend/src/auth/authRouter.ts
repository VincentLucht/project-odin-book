import express from 'express';
import authController from '@/auth/authController';
import authValidator from '@/auth/authValidator';

// /auth is base path
const authRouter = express.Router();

authRouter.post('/login', authValidator.loginRules(), authController.login);
authRouter.post('/sign-up', authValidator.signUpRules(), authController.signUp);

export default authRouter;

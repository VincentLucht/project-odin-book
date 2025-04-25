import express from 'express';
import token from '@/auth/token';
import reportController from '@/report/reportController';
import reportValidator from '@/report/reportValidator';

// /report
const reportRouter = express.Router();

reportRouter.get(
  '', // ?
  token.authenticate,
);

reportRouter.post(
  '',
  token.authenticate,
  reportValidator.replyToMessageRules(),
  reportController.report,
);

reportRouter.put('', token.authenticate);

export default reportRouter;

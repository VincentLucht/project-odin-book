import express from 'express';
import token from '@/auth/token';
import reportController from '@/report/reportController';
import reportValidator from '@/report/reportValidator';

// /report
const reportRouter = express.Router();

reportRouter.get(
  '', // ?cn=community_name&t=type&sbt=sort_by_type&sl=status&ls=last_score&ld=_last_date&cId=cursorId
  token.authenticate,
  reportValidator.fetchRules(),
  reportController.fetch,
);

reportRouter.post(
  '',
  token.authenticate,
  reportValidator.replyToMessageRules(),
  reportController.report,
);

reportRouter.put('', token.authenticate);

export default reportRouter;

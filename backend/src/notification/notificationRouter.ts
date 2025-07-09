import express from 'express';
import token from '@/auth/token';
import notificationController from '@/notification/notificationController';
import notificationValidator from '@/notification/notificationValidator';

// /notification
const notificationRouter = express.Router();

notificationRouter.get(
  '',
  token.authenticate,
  notificationValidator.fetchByRules(),
  notificationController.fetchBy,
);

notificationRouter.get(
  '/unread-status',
  token.authenticate,
  notificationController.hasUnreadNotifications,
);

notificationRouter.post('', token.authenticate);

notificationRouter.put(
  '/read-all',
  token.authenticate,
  notificationController.markAllAsRead,
);

notificationRouter.put(
  '/read',
  token.authenticate,
  notificationValidator.readRules(),
  notificationController.read,
);

notificationRouter.put(
  '/open',
  token.authenticate,
  notificationController.openAll,
);

notificationRouter.put(
  '/hide',
  token.authenticate,
  notificationValidator.hideRules(),
  notificationController.hide,
);

notificationRouter.delete('', token.authenticate);

export default notificationRouter;

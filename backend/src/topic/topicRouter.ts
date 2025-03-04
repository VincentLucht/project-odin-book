import express from 'express';
import topicController from '@/topic/topicController';

// /topic
const topicRouter = express.Router();

topicRouter.get('', topicController.getAll);

export default topicRouter;

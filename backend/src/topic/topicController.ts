import { Request, Response } from 'express';

import db from '@/db/db';
import { checkValidationError } from '@/util/checkValidationError';
import { asyncHandler } from '@/util/asyncHandler';

class TopicController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    if (checkValidationError(req, res)) return;

    try {
      const topics = await db.topic.getAllMainAndSubTopics();

      return res.status(200).json({
        message: 'Successfully fetched all topics',
        topics,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to fetch topics',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

const topicController = new TopicController();
export default topicController;

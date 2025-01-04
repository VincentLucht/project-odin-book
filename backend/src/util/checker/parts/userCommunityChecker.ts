import { DB } from '@/db/db';
import { Response } from 'express';

export default class UserCommunityChecker {
  constructor(private db: DB) {}

  async isMember(res: Response, user_id: string, community_id: string) {
    const isMember = await this.db.userCommunity.isMember(
      user_id,
      community_id,
    );
    if (isMember) {
      res.status(409).json({ message: 'You already joined that community' });
      return true;
    }

    return false;
  }

  async isNotMember(res: Response, user_id: string, community_id: string) {
    const isMember = await this.db.userCommunity.isMember(
      user_id,
      community_id,
    );
    if (!isMember) {
      res.status(409).json({ message: 'You are not part of this community' });
      return true;
    }

    return false;
  }
}

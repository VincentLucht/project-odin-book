import { DB } from '@/db/db';
import { Response } from 'express';

export default class CommunityFlairChecker {
  constructor(private db: DB) {}

  async foundName(res: Response, community_id: string, name: string) {
    const found = await this.db.communityFlair.doesExist(community_id, name);
    if (found) {
      res.status(409).json({ message: 'Flair already exists' });
      return true;
    }

    return false;
  }
}

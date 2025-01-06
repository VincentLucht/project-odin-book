import { DB } from '@/db/db';
import { Response } from 'express';

export default class CommunityChecker {
  constructor(private db: DB) {}

  async notFoundById(res: Response, id: string) {
    const community = await this.db.community.foundById(id);
    if (!community) {
      res.status(404).json({ message: 'Community does not exist' });
      return true;
    }

    return false;
  }

  async foundByName(res: Response, name: string) {
    const community = await this.db.community.foundByName(name);
    if (community) {
      res.status(409).json({ message: 'Community name is already in use' });
      return true;
    }

    return false;
  }

  async isPrivate(res: Response, community_id: string) {
    const isPrivate = await this.db.community.isPrivate(community_id);
    if (isPrivate) {
      res.status(400).json({ message: 'Can not join private community' });
      return true;
    }

    return false;
  }
}

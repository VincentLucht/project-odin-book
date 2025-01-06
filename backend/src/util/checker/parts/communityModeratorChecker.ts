import { DB } from '@/db/db';
import { Response } from 'express';

export default class CommunityModeratorChecker {
  constructor(private db: DB) {}

  async foundById(res: Response, user_id: string, community_id: string) {
    const isMod = await this.db.communityModerator.isMod(user_id, community_id);
    if (isMod) {
      res.status(404).json({ message: 'User already is an admin' });
      return true;
    }

    return false;
  }

  async notFoundById(res: Response, user_id: string, community_id: string) {
    const isMod = await this.db.communityModerator.isMod(user_id, community_id);
    if (!isMod) {
      res
        .status(404)
        .json({ message: 'You are not a moderator in this community' });
      return true;
    }

    return false;
  }

  async foundByName(res: Response, name: string) {
    const community = await this.db.community.notFoundByName(name);
    if (community) {
      res.status(409).json({ message: 'Community name is already in use' });
      return true;
    }

    return false;
  }
}

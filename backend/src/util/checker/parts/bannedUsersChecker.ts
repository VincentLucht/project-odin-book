import { DB } from '@/db/db';
import { Response } from 'express';

export default class BannedUsersChecker {
  constructor(private db: DB) {}

  async isBanned(res: Response, user_id: string, community_id: string) {
    const isBanned = await this.db.bannedUsers.isBanned(user_id, community_id);
    if (isBanned) {
      res.status(403).json({ message: "Can't join community when banned" });
      return true;
    }

    return false;
  }
}

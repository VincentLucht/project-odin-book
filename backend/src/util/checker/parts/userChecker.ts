import { DB } from '@/db/db';
import { Response } from 'express';

export default class UserChecker {
  constructor(private db: DB) {}

  async foundById(res: Response, id: string) {
    const user = await this.db.user.getUserById(id);
    if (user) {
      res.status(409).json({ message: 'User already exists' });
      return true;
    }

    return false;
  }

  async notFoundById(res: Response, id: string) {
    const user = await this.db.user.getUserById(id);
    if (!user) {
      res.status(404).json({ message: 'User does not exist' });
      return true;
    }

    return false;
  }

  async foundByUsername(res: Response, username: string) {
    const user = await this.db.user.getUserByUsername(username);
    if (user) {
      res.status(409).json({ message: 'User already exists' });
      return true;
    }

    return false;
  }

  async emailFound(res: Response, email: string) {
    const user = await this.db.user.getUserByEmail(email);
    if (user) {
      res.status(409).json({ message: 'Email already in use' });
      return true;
    }

    return false;
  }
}

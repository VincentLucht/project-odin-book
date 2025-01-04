import { Checker } from '@/util/checker/checker';
import { Response } from 'express';

export class MockBannedUsersChecker {
  constructor(private checker: Checker) {}

  isBanned() {
    jest
      .mocked(this.checker.bannedUsers.isBanned)
      .mockImplementation(async (res: Response) => {
        res.status(403).json({ message: "Can't join community when banned" });
        return true;
      });
  }
}

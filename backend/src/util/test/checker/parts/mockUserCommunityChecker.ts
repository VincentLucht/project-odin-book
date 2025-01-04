import { Checker } from '@/util/checker/checker';
import { Response } from 'express';

export class MockUserCommunityChecker {
  constructor(private checker: Checker) {}

  async isMember() {
    jest
      .mocked(this.checker.userCommunity.isMember)
      .mockImplementation(async (res: Response) => {
        res.status(409).json({ message: 'You already joined that community' });
        return true;
      });
  }

  async isNotMember() {
    jest
      .mocked(this.checker.userCommunity.isNotMember)
      .mockImplementation(async (res: Response) => {
        res.status(409).json({ message: 'You are not part of this community' });
        return true;
      });
  }
}

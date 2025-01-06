import { Checker } from '@/util/checker/checker';
import { Response } from 'express';

export class MockCommunityModeratorChecker {
  constructor(private checker: Checker) {}

  foundById() {
    jest
      .mocked(this.checker.communityModerator.notFoundById)
      .mockImplementation(async (res: Response) => {
        res
          .status(404)
          .json({ message: 'You are not a moderator in this community' });
        return true;
      });
  }
}

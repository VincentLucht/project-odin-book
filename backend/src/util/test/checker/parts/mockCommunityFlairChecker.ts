import { Checker } from '@/util/checker/checker';
import { Response } from 'express';

export class MockCommunityFlairChecker {
  constructor(private checker: Checker) {}

  foundName() {
    jest
      .mocked(this.checker.communityFlair.foundName)
      .mockImplementation(async (res: Response) => {
        res.status(409).json({ message: 'Flair already exists' });
        return true;
      });
  }
}

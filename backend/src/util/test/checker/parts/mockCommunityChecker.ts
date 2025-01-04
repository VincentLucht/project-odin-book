import { Checker } from '@/util/checker/checker';
import { Response } from 'express';

export class MockCommunityChecker {
  constructor(private checker: Checker) {}

  notFoundById() {
    jest
      .mocked(this.checker.community.notFoundById)
      .mockImplementation(async (res: Response) => {
        res.status(404).json({ message: 'Community does not exist' });
        return true;
      });
  }

  foundByName() {
    jest
      .mocked(this.checker.community.foundByName)
      .mockImplementation(async (res: Response) => {
        res.status(409).json({ message: 'Community Name already in use' });
        return true;
      });
  }

  isPrivate() {
    jest
      .mocked(this.checker.community.isPrivate)
      .mockImplementation(async (res: Response) => {
        res.status(400).json({ message: 'Can not join private community' });
        return true;
      });
  }
}

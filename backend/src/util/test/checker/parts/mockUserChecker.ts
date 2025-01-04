import { Checker } from '@/util/checker/checker';
import { Response } from 'express';

export class MockUserChecker {
  constructor(private checker: Checker) {}

  foundById() {
    jest
      .mocked(this.checker.user.foundById)
      .mockImplementation(async (res: Response) => {
        res.status(409).json({ message: 'User already exists' });
        return true;
      });
  }

  notFoundById() {
    jest
      .mocked(this.checker.user.notFoundById)
      .mockImplementation(async (res: Response) => {
        res.status(404).json({ message: 'User does not exist' });
        return true;
      });
  }

  foundByUsername() {
    jest
      .mocked(this.checker.user.foundByUsername)
      .mockImplementation(async (res: Response) => {
        res.status(409).json({ message: 'User already exists' });
        return true;
      });
  }

  emailFound() {
    jest
      .mocked(this.checker.user.emailFound)
      .mockImplementation(async (res: Response) => {
        res.status(409).json({ message: 'Email already in use' });
        return true;
      });
  }
}

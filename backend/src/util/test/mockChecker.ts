import checker from '@/util/checker/checker';
import { Response } from 'express';

class MockChecker {
  mockUserExistenceCheck(status: number, message: string) {
    jest
      .mocked(checker.user.foundByUsername)
      .mockImplementation(async (res: Response) => {
        res.status(status).json({ message });
        return true;
      });
  }

  mockEmailExistenceCheck(status: number, message: string) {
    jest
      .mocked(checker.user.emailFound)
      .mockImplementationOnce(async (res: Response) => {
        res.status(status).json({ message });
        return true;
      });
  }

  mockDbError() {
    jest
      .mocked(checker.user.foundByUsername)
      .mockImplementation(async (res: Response) => {
        res.status(500).json({ message: 'Database error' });
        return true;
      });
  }
}

const mockChecker = new MockChecker();
export default mockChecker;

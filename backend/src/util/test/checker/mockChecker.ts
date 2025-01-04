import { Response } from 'express';
import checker from '@/util/checker/checker';
import { MockUserChecker } from '@/util/test/checker/parts/mockUserChecker';
import { MockCommunityChecker } from '@/util/test/checker/parts/mockCommunityChecker';
import { MockUserCommunityChecker } from '@/util/test/checker/parts/mockUserCommunityChecker';
import { MockBannedUsersChecker } from '@/util/test/checker/parts/mockBannedUsersChecker';

class MockChecker {
  public user: MockUserChecker;
  public community: MockCommunityChecker;
  public userCommunity: MockUserCommunityChecker;
  public bannedUsers: MockBannedUsersChecker;

  constructor() {
    this.user = new MockUserChecker(checker);
    this.community = new MockCommunityChecker(checker);
    this.userCommunity = new MockUserCommunityChecker(checker);
    this.bannedUsers = new MockBannedUsersChecker(checker);
  }

  dbError = {
    user: {
      foundByUsername: () => {
        jest
          .mocked(checker.user.foundByUsername)
          .mockImplementation(async (res: Response) => {
            res.status(500).json({ message: 'Database error' });
            return true;
          });
      },
      notFoundById: () => {
        jest
          .mocked(checker.user.notFoundById)
          .mockImplementation(async (res: Response) => {
            res.status(500).json({ message: 'Database error' });
            return true;
          });
      },
    },
    community: {
      notFoundById: () => {
        jest
          .mocked(checker.community.notFoundById)
          .mockImplementation(async (res: Response) => {
            res.status(500).json({ message: 'Database error' });
            return true;
          });
      },
    },
  };
}

const mockChecker = new MockChecker();
export default mockChecker;

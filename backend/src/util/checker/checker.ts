import db, { DB } from '@/db/db';
import UserChecker from '@/util/checker/parts/userChecker';
import CommunityChecker from '@/util/checker/parts/communityChecker';
import UserCommunityChecker from '@/util/checker/parts/userCommunityChecker';
import BannedUsersChecker from '@/util/checker/parts/bannedUsersChecker';

/**
 * Wrapper Class that checks frequent DB queries, like an user not being found and responds with the corresponding return status and message
 */
export class Checker {
  private db: DB;
  public user: UserChecker;
  public community: CommunityChecker;
  public userCommunity: UserCommunityChecker;
  public bannedUsers: BannedUsersChecker;

  constructor() {
    this.db = db;
    this.user = new UserChecker(this.db);
    this.community = new CommunityChecker(this.db);
    this.userCommunity = new UserCommunityChecker(this.db);
    this.bannedUsers = new BannedUsersChecker(this.db);
  }
}

const checker = new Checker();
export default checker;

import db, { DB } from '@/db/db';
import UserChecker from '@/util/checker/parts/userChecker';

/**
 * Wrapper Class that checks frequent DB queries, like an user not being found and responds with the corresponding return status and message
 */
class Checker {
  private db: DB;
  public user: UserChecker;

  constructor() {
    this.db = db;
    this.user = new UserChecker(this.db);
  }
}

const checker = new Checker();
export default checker;

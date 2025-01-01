import { PrismaClient } from '@prisma/client/default';

import UserManager from '@/db/managers/userManager';
import CommunityManager from '@/db/managers/communityManager';

export class DB {
  private prisma: PrismaClient;
  public user: UserManager;
  public community: CommunityManager;

  constructor() {
    this.prisma = new PrismaClient();
    this.user = new UserManager(this.prisma);
    this.community = new CommunityManager(this.prisma);
  }
}

const db = new DB();
export default db;

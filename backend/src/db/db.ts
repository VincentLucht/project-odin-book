import { PrismaClient } from '@prisma/client/default';

import UserManager from '@/db/managers/userManager';
import CommunityManager from '@/db/managers/communityManager';
import TopicManager from '@/db/managers/communityTopicManager';
import UserCommunityManager from '@/db/managers/userCommunityManager';
import BannedUsersManager from '@/db/managers/bannedUsersManager';

export class DB {
  private prisma: PrismaClient;
  public user: UserManager;
  public community: CommunityManager;
  public userCommunity: UserCommunityManager;
  public bannedUsers: BannedUsersManager;
  public topic: TopicManager;

  constructor() {
    this.prisma = new PrismaClient();
    this.user = new UserManager(this.prisma);
    this.community = new CommunityManager(this.prisma);
    this.userCommunity = new UserCommunityManager(this.prisma);
    this.bannedUsers = new BannedUsersManager(this.prisma);
    this.topic = new TopicManager(this.prisma);
  }
}

const db = new DB();
export default db;

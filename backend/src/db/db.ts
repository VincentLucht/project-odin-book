import { PrismaClient } from '@prisma/client/default';

import UserManager from '@/db/managers/userManager';
import CommunityManager from '@/db/managers/communityManager';
import TopicManager from '@/db/managers/topicManager';
import UserCommunityManager from '@/db/managers/userCommunityManager';
import BannedUsersManager from '@/db/managers/bannedUsersManager';
import CommunityModeratorManager from '@/db/managers/communityModeratorManager';
import CommunityFlairManager from '@/db/managers/communityFlairManager';

export class DB {
  private prisma: PrismaClient;
  public user: UserManager;
  public community: CommunityManager;
  public userCommunity: UserCommunityManager;
  public communityModerator: CommunityModeratorManager;
  public bannedUsers: BannedUsersManager;
  public topic: TopicManager;
  public communityFlair: CommunityFlairManager;

  constructor() {
    this.prisma = new PrismaClient();
    this.user = new UserManager(this.prisma);
    this.community = new CommunityManager(this.prisma);
    this.userCommunity = new UserCommunityManager(this.prisma);
    this.communityModerator = new CommunityModeratorManager(this.prisma);
    this.bannedUsers = new BannedUsersManager(this.prisma);
    this.topic = new TopicManager(this.prisma);
    this.communityFlair = new CommunityFlairManager(this.prisma);
  }
}

const db = new DB();
export default db;

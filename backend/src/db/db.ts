import { PrismaClient } from '@prisma/client/default';

import UserManager from '@/db/managers/userManager/userManager';
import CommunityManager from '@/db/managers/communityManager/communityManager';
import TopicManager from '@/db/managers/topicManager';
import UserCommunityManager from '@/db/managers/userCommunityManager';
import BannedUsersManager from '@/db/managers/bannedUsersManager';
import CommunityModeratorManager from '@/db/managers/communityModeratorManager';
import CommunityFlairManager from '@/db/managers/communityFlairManager';
import PostManager from '@/db/managers/postManager/postManager';
import PostVoteManager from '@/db/managers/postVoteManager';
import CommentManager from '@/db/managers/commentManager/commentManager';
import CommentVoteManager from '@/db/managers/commentVoteManager';
import UserAssignedFlairManager from '@/db/managers/userAssignedFlairManager';
import PostAssignedFlairManager from '@/db/managers/postAssignedFlairManager';
import RecentCommunitiesManager from '@/db/managers/recentCommunitiesManager';

export class DB {
  private prisma: PrismaClient;
  public user: UserManager;
  public community: CommunityManager;
  public userCommunity: UserCommunityManager;
  public communityModerator: CommunityModeratorManager;
  public bannedUsers: BannedUsersManager;
  public topic: TopicManager;
  public communityFlair: CommunityFlairManager;
  public post: PostManager;
  public postVote: PostVoteManager;
  public comment: CommentManager;
  public commentVote: CommentVoteManager;
  public userAssignedFlair: UserAssignedFlairManager;
  public postAssignedFlair: PostAssignedFlairManager;
  public recentCommunities: RecentCommunitiesManager;

  constructor() {
    this.prisma = new PrismaClient();
    this.user = new UserManager(this.prisma);
    this.community = new CommunityManager(this.prisma);
    this.userCommunity = new UserCommunityManager(this.prisma);
    this.communityModerator = new CommunityModeratorManager(this.prisma);
    this.bannedUsers = new BannedUsersManager(this.prisma);
    this.topic = new TopicManager(this.prisma);
    this.communityFlair = new CommunityFlairManager(this.prisma);
    this.post = new PostManager(this.prisma);
    this.postVote = new PostVoteManager(this.prisma);
    this.comment = new CommentManager(this.prisma);
    this.commentVote = new CommentVoteManager(this.prisma);
    this.userAssignedFlair = new UserAssignedFlairManager(this.prisma);
    this.postAssignedFlair = new PostAssignedFlairManager(this.prisma);
    this.recentCommunities = new RecentCommunitiesManager(this.prisma);
  }
}

const db = new DB();
export default db;

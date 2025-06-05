import { PrismaClient } from '@prisma/client/default';

import UserManager from '@/db/managers/userManager/userManager';
import CommunityManager from '@/db/managers/communityManager/communityManager';
import TopicManager from '@/db/managers/topicManager';
import UserCommunityManager from '@/db/managers/userCommunityManager';
import BannedUsersManager from '@/db/managers/bannedUsersManager';
import CommunityModeratorManager from '@/db/managers/communityModeratorManager';
import PostModerationManager from '@/db/managers/postModerationManager';
import CommunityFlairManager from '@/db/managers/communityFlairManager';
import PostManager from '@/db/managers/postManager/postManager';
import PostVoteManager from '@/db/managers/postVoteManager';
import CommentModerationManager from '@/db/managers/commentModerationManager';
import CommentManager from '@/db/managers/commentManager/commentManager';
import CommentVoteManager from '@/db/managers/commentVoteManager';
import UserAssignedFlairManager from '@/db/managers/userAssignedFlairManager';
import PostAssignedFlairManager from '@/db/managers/postAssignedFlairManager';
import RecentCommunitiesManager from '@/db/managers/recentCommunitiesManager';
import JoinRequestManager from '@/db/managers/joinRequestManager';
import SearchResultsManager from '@/db/managers/misc/searchResultsManager';
import NotificationManager from '@/db/managers/notificationManager';
import ModMailManager from '@/db/managers/modMailManager';
import ReportManager from '@/db/managers/reportManager/reportManager';

import ChatManager from '@/db/managers/chat/chatManager';
import MessageManager from '@/db/managers/chat/messageManager';
import UserChatManager from '@/db/managers/chat/userChatsManager';
import ChatAdminManager from '@/db/managers/chat/chatAdminManager';

export class DB {
  private prisma: PrismaClient;
  public user: UserManager;
  public community: CommunityManager;
  public userCommunity: UserCommunityManager;
  public communityModerator: CommunityModeratorManager;
  public postModeration: PostModerationManager;
  public commentModeration: CommentModerationManager;
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
  public joinRequest: JoinRequestManager;
  public searchResults: SearchResultsManager;
  public notification: NotificationManager;
  public modMail: ModMailManager;
  public report: ReportManager;

  public chat: ChatManager;
  public message: MessageManager;
  public userChat: UserChatManager;
  public chatAdmin: ChatAdminManager;

  constructor() {
    this.prisma = new PrismaClient();
    this.user = new UserManager(this.prisma);
    this.community = new CommunityManager(this.prisma);
    this.userCommunity = new UserCommunityManager(this.prisma);
    this.communityModerator = new CommunityModeratorManager(this.prisma);
    this.postModeration = new PostModerationManager(this.prisma);
    this.commentModeration = new CommentModerationManager(this.prisma);
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
    this.joinRequest = new JoinRequestManager(this.prisma);
    this.searchResults = new SearchResultsManager(this.prisma);
    this.notification = new NotificationManager(this.prisma, this.user);
    this.modMail = new ModMailManager(this.prisma);
    this.report = new ReportManager(this.prisma);

    this.chat = new ChatManager(this.prisma);
    this.message = new MessageManager(this.prisma);
    this.userChat = new UserChatManager(this.prisma);
    this.chatAdmin = new ChatAdminManager(this.prisma);
  }
}

const db = new DB();
export default db;

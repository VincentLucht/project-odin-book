import { VoteType } from '@/interface/backendTypes';
import { PostType } from '@/Main/CreatePost/CreatePost';
import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';

export interface DBUserSettings {
  id: string;
  community_enabled: boolean;
  posts_enabled: boolean;
  comments_enabled: boolean;
  mods_enabled: boolean;
  chats_enabled: boolean;
  follow_enabled: boolean;
  user_id: string;
}

export interface DBUser {
  id: string;
  username: string;
  email: string;
  password: null;
  display_name: string | null;
  profile_picture_url: string | null;
  description: string | null;
  cake_day: string | null;
  created_at: Date;
  deleted_at: Date | null;
  is_mature: boolean;

  post_karma: number;
  comment_karma: number;
}

export interface DBPost {
  id: string;
  community_id: string;
  poster_id: string | null;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  edited_at?: Date;
  deleted_at?: Date;
  is_spoiler: boolean;
  is_mature: boolean;
  pinned_at?: Date | null;
  upvote_count: number;
  downvote_count: number;
  total_vote_score: number;
  total_comment_score: number;
  post_type: PostType;
  lock_comments: boolean;
}

export interface DBCommunity {
  id: string;
  name: string;
  description: string | null;
  profile_picture_url: string | null;
  banner_url_desktop: string | null;
  banner_url_mobile: string | null;
  created_at: Date | string;
  is_mature: boolean;
  is_post_flair_required: boolean;
  allow_basic_user_posts: boolean;
  total_members: number;
  type: CommunityTypes;
  owner_id: string;
}

export interface DBComment {
  id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  edited_at: Date;
  is_deleted: boolean;
  upvote_count: number;
  downvote_count: number;
  total_vote_score: number;

  post_id: string;
  user_id?: string;
  parent_comment_id?: string;
}

export interface DBPostAssignedFlair {
  id: string;
  post_id: string;
  community_flair_id: string;
}

export interface DBCommunityFlair {
  id: string;
  community_id: string;
  textColor: string;
  name: string;
  color: string;
  emoji: string | null;
  is_assignable_to_posts: boolean;
  is_assignable_to_users: boolean;
}

export interface DBMainTopic {
  id: string;
  name: string;
  topics: DBTopic[];
}
export interface DBTopic {
  id: string;
  name: string;
  main_category_id: string;
  isActive?: boolean;
}

export type PostAssignedFlair = {
  id: string;
  community_flair: DBCommunityFlair;
}[];

export type UserAssignedFlair = {
  id: string;
  community_flair: DBCommunityFlair;
}[];

export interface DBCommunityRule {
  id: string;
  order: number;
  title: string;
  text: string;
  community_id: string;
  created_at: string;
}

export interface DBCommunityModerator {
  id: string;
  username: string;
  profile_picture_url: string;
}

export type ModerationType = 'APPROVED' | 'REMOVED';

export interface DBPostModeration {
  id: string;
  post_id: string;
  moderator_id: string;
  action: ModerationType;
  reason?: string;
  created_at: string;
  moderator: { user: { username: string; profile_picture_url: string | null } };
}

export interface DBCommentModeration {
  id: string;
  comment_id: string;
  moderator_id: string;
  action: ModerationType;
  reason?: string;
  created_at: string;
  moderator: { user: { username: string; profile_picture_url: string | null } };
}

export interface DBModMail {
  id: string;
  subject: string;
  message: string;
  created_at: string;
  is_archived: boolean;
  has_replied: boolean;
  sender_id: string;
  community_id: string;
}

type ReportedTypes = 'POST' | 'COMMENT';
type ReportedStatus = 'PENDING' | 'REVIEWED' | 'DISMISSED';
export interface DBReport {
  id: string;
  item_type: ReportedTypes;
  reporter_id: string;
  subject: string;
  reason: string;
  created_at: string;
  status: ReportedStatus;

  moderator_id?: string;
  moderated_at?: string;
  removal_reason?: string;

  post_id: string | null;
  comment_id: string | null;
}

export type NotificationType =
  | 'COMMUNITYMESSAGE'
  | 'POSTREPLY'
  | 'COMMENTREPLY'
  | 'MODMESSAGE'
  | 'MODMAILREPLY'
  | 'CHATMESSAGE'
  | 'NEWFOLLOWER';
export interface DBNotification {
  id: string;
  subject: string;
  message: string | null;
  created_at: Date;
  is_hidden: boolean;
  read_at?: Date | null;
  type: NotificationType;
  sender_user_id?: string | null;
  sender_user?: {
    username: string;
    profile_picture_url: string | undefined;
  };
  sender_community_id?: string | null;
  sender_community?: {
    name: string;
    profile_picture_url: string | undefined;
  };
  receiver_id: string;
  link: string | undefined;
}

export interface DBChat {
  id: string;
  name: string;
  time_created: string;
  profile_picture_url: string | null;
  is_group_chat: boolean;
  chat_description: string | null;
  updated_at: string;
  last_message_id: string | null;
  owner_id: string;
}

export interface DBMessage {
  id: string;
  content: string;
  time_created: string;
  user_id: string;
  user: {
    id: string;
    username: string;
    profile_picture_url: string | null;
    deleted_at: string | null;
  };
  is_system_message: boolean;
  chat_id: string;
  iv: string;
}

export interface DBUserChats {
  id: string;
  user_id: string;
  chat_id: string;
  is_muted: boolean;
  joined_at: string;
}

// EXTENSIONS
export type CommunityTypes = 'PUBLIC' | 'RESTRICTED' | 'PRIVATE';
export type UserRoles = 'BASIC' | 'CONTRIBUTOR';

export interface VotingRecord {
  user_id: string;
  vote_type: VoteType;
}
export interface CommunityMembership {
  user_id: string;
}

export interface DBPostWithModeration extends DBPost {
  moderation?: DBPostModeration;
}

export interface DBPostWithCommunityName extends DBPostWithModeration {
  community: {
    id: string;
    name: string;
    profile_picture_url: string | null;
    user_communities: CommunityMembership[] | undefined;
    type?: CommunityTypes;
  };
  post_votes: VotingRecord[] | undefined;
  poster: {
    id: string;
    username: string;
    profile_picture_url: string | null;
    deleted_at: string | null;
  } | null;
  post_assigned_flair: PostAssignedFlair;
  reports: DBReport[];
  saved_by: { user_id: string }[];
}

export interface DBCommentWithCommunityName extends DBComment {
  post: {
    title: string;
    community: {
      name: string;
      profile_picture_url: string | null;
      type?: CommunityTypes;
    };
  };
  comment_votes: VotingRecord[] | undefined;
  user: { username: string };
  saved_by?: { user_id: string }[];
  reports?: DBReport[];
}

export interface SavedComment extends DBComment {
  post: {
    title: string;
    community: {
      name: string;
      profile_picture_url: string | null;
      type?: CommunityTypes;
    };
  };
  comment_votes: VotingRecord[] | undefined;
  user: { username: string };
  moderator_id: string | null;
  moderation: DBCommentModeration;
  saved_by?: { user_id: string }[];
}

export interface DBPostWithCommunity extends DBPostWithModeration {
  poster: { username: string; deleted_at: string | null } | null;
  post_votes: VotingRecord[];
  community: FetchedCommunity & { is_moderator?: boolean };
  post_assigned_flair: PostAssignedFlair;
  reports: DBReport[];
  saved_by: { user_id: string }[];
}

export interface DBCommentWithReplies extends DBComment {
  user: {
    username: string;
    profile_picture_url: string | null;
    deleted_at: string | null;
  } | null;
  reports?: DBReport[];
  comment_votes: VotingRecord[];
  replies: DBCommentWithReplies[];
  saved_by: { user_id: string }[];
  _count: { replies: number };
  moderation: DBCommentModeration;
}

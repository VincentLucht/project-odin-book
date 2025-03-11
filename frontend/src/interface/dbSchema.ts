import { VoteType } from '@/interface/backendTypes';

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
  deletedAt: Date | null;

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
  color: string;
  emoji: string;
  is_assignable_to_posts: boolean;
  is_assignable_to_users: boolean;
  name: string;
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

export interface DBPostWithCommunityName extends DBPost {
  community: {
    id: string;
    name: string;
    profile_picture_url: string | null;
    user_communities: CommunityMembership[] | undefined;
  };
  post_votes: VotingRecord[] | undefined;
  poster: { id: string; username: string; profile_picture_url: string | null } | null;
}

export interface DBCommentWithCommunityName extends DBComment {
  post: {
    title: string;
    community: { name: string; profile_picture_url: string | null };
  };
  user_communities: CommunityMembership[];
  comment_votes: VotingRecord[];
  user: { username: string };
}

export interface DBPostAssignedFlairWithCommunityFlair extends DBPostAssignedFlair {
  community_flair: DBCommunityFlair;
}
export interface DBPostWithCommunity extends DBPost {
  poster: { username: string } | null;
  post_votes: VotingRecord[];
  community: {
    id: string;
    name: string;
    description: string | null;
    profile_picture_url: string | null;
    created_at: string;
    is_mature: boolean;
    user_communities: CommunityMembership[];
  };
  post_assigned_flair: DBPostAssignedFlairWithCommunityFlair[];
}

export interface DBCommentWithReplies extends DBComment {
  user: { username: string; profile_picture_url: string | null } | null;
  comment_votes: VotingRecord[];
  replies: DBCommentWithReplies[];
  _count: { replies: number };
}

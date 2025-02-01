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
  poster_id: string;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  is_spoiler: boolean;
  is_mature: boolean;
  pinned_at?: Date;
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
  is_deleted: boolean;
  upvote_count: number;
  downvote_count: number;
  total_vote_score: number;

  post_id: string;
  user_id?: string;
  parent_comment_id?: string;
}

// EXTENSIONS
export interface DBPostWithCommunityName extends DBPost {
  community: {
    name: string;
    profile_picture_url: string | null;
    user_communities: { user_id: string }[];
  };
  post_votes: { user_id: string; vote_type: VoteType }[];
}

export interface DBCommentWithCommunityName extends DBComment {
  post: {
    title: string;
    community: { name: string; profile_picture_url: string | null };
  };
  user_communities: { user_id: string }[];
  comment_votes: { user_id: string; vote_type: VoteType }[];
}

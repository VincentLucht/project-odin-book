import { DBCommentWithReplies } from '@/interface/dbSchema';

export default function createTempComment(
  content: string,
  post_id: string,
  user_id: string,
  username: string,
  profile_picture_url: string | undefined,
  parent_comment_id: string | undefined,
) {
  const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

  const tempComment: DBCommentWithReplies = {
    id: tempId,
    content,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    upvote_count: 1,
    downvote_count: 0,
    total_vote_score: 1,

    post_id,
    user_id,
    user: {
      username,
      profile_picture_url: profile_picture_url ?? null,
      deleted_at: '',
    },
    replies: [],
    comment_votes: [{ user_id, vote_type: 'UPVOTE' }],
    parent_comment_id,
    edited_at: null,
    moderation: null,
    saved_by: [],
    reports: [],
    _count: { replies: 0 },
  };

  return tempComment;
}

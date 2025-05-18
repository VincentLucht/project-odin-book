import { UserHistory } from '@/db/managers/userManager/userManager';

export default function formatUserHistory(userHistory: UserHistory[]) {
  return userHistory.map((item) => {
    if (item.record_type === 'post') {
      return {
        id: item.id,
        community_id: item.community_id,
        poster_id: item.user_id,
        title: item.title,
        body: item.content,
        created_at: item.created_at,
        updated_at: item.updated_at,
        edited_at: item.edited_at,
        deleted_at: item.deleted_at,
        is_spoiler: item.is_spoiler,
        is_mature: item.is_mature,
        // TODO: Pinned Posts
        upvote_count: item.upvote_count,
        downvote_count: item.downvote_count,
        total_vote_score: item.vote_score,
        total_comment_score: item.total_comment_score,
        post_type: item.post_type,
        lock_comment: item.lock_comments,
        item_type: item.record_type,
        removed_by_moderation:
          item.moderation_type === 'REMOVED' ? true : false,
        community: {
          id: item.community_id,
          name: item.community_name,
          profile_picture_url: item.community_pfp,
          user_communities: [{ user_id: item.membership_user_id }],
          type: item.community_type,
        },
        post_votes: [
          {
            user_id: item.vote_user_id,
            vote_type: item.vote_type,
          },
        ],
        reports: [
          {
            id: item.report_id,
            item_type: item.report_item_type,
            reporter_id: item.report_reporter_id,
            subject: item.report_subject,
            reason: item.report_reason,
            created_at: item.report_created_at,
            status: item.report_status,
            moderator_id: item.report_moderator_id,
            moderated_at: item.report_moderated_at,
            removal_reason: item.report_removal_reason,
            community_id: item.report_community_id,
            post_id: item.report_post_id,
            comment_id: item.report_comment_id,
          },
        ],
      };
    } else if (item.record_type === 'comment') {
      return {
        id: item.id,
        content: item.content,
        created_at: item.created_at,
        updated_at: item.updated_at,
        edited_at: item.edited_at,
        is_deleted: item.is_deleted,
        upvote_count: item.upvote_count,
        downvote_count: item.downvote_count,
        total_vote_score: item.vote_score,
        item_type: item.record_type,
        removed_by_moderation:
          item.moderation_type === 'REMOVED' ? true : false,
        post_id: item.post_id,
        community: {
          name: item.community_name,
          profile_picture_url: item.community_pfp,
          type: item.community_type,
        },
        comment_votes: [
          {
            user_id: item.vote_user_id,
            vote_type: item.vote_type,
          },
        ],
        post: {
          title: item.title,
          community: {
            name: item.community_name,
            profile_picture_url: item.community_pfp,
          },
        },
        user: {
          username: item.poster_username,
        },
        reports: [
          {
            id: item.report_id,
            item_type: item.report_item_type,
            reporter_id: item.report_reporter_id,
            subject: item.report_subject,
            reason: item.report_reason,
            created_at: item.report_created_at,
            status: item.report_status,
            moderator_id: item.report_moderator_id,
            moderated_at: item.report_moderated_at,
            removal_reason: item.report_removal_reason,
            community_id: item.report_community_id,
            post_id: item.report_post_id,
            comment_id: item.report_comment_id,
          },
        ],
      };
    }
  });
}

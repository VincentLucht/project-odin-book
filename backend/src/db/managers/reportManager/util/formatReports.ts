import { FetchedReports } from '@/db/managers/reportManager/reportManager';

export default function formatReports(reports: FetchedReports[]) {
  return reports.map((report) => ({
    id: report.id,
    item_type: report.item_type,
    reporter_id: report.reporter_id,
    subject: report.subject,
    reason: report.reason,
    created_at: report.created_at,
    status: report.status,
    community_id: report.community_id,
    report_count: report.report_count,
    moderated_at: report.moderated_at,
    removal_reason: report.removal_reason,

    post_id: report.post_id,
    post: {
      id: report.post_id,
      title: report.post_title,
      body: report.post_body,
      total_vote_score: report.post_total_vote_score,
      upvote_count: report.post_upvote_count,
      downvote_count: report.post_downvote_count,
      community_name: report.post_community_name,
    },

    comment_id: report.comment_id,
    comment: {
      id: report.comment_id,
      content: report.comment_content,
      total_vote_score: report.comment_total_vote_score,
      upvote_count: report.comment_upvote_count,
      downvote_count: report.comment_downvote_count,
      parent_post: {
        id: report.parent_post_id,
        title: report.parent_post_title,
        body: report.parent_post_body,
        community_name: report.parent_post_community_name,
      },
    },

    user: {
      username: report.username,
      profile_picture_url: report.profile_picture_url,
    },

    moderator: {
      username: report.moderator_username,
      profile_picture_url: report.moderator_pfp,
    },
  }));
}

export function transformPostsSearch(posts: any[]) {
  return posts.map((post) => {
    return {
      id: post.id,
      community_id: post.community_id,
      poster_id: post.poster_id,
      title: post.title,
      body: post.body,
      created_at: post.created_at,
      updated_at: post.updated_at,
      edited_at: post.edited_at,
      deleted_at: post.deleted_at,
      is_spoiler: post.is_spoiler,
      is_mature: post.is_mature,
      pinned_at: post.pinned_at,
      upvote_count: post.upvote_count,
      downvote_count: post.downvote_count,
      total_vote_score: post.total_vote_score,
      total_comment_score: post.total_comment_score,
      post_type: post.post_type,
      community: {
        name: post.community_name,
        profile_picture_url: post.profile_picture_url,
        type: post.community_type,
        is_mature: post.community_is_mature,
      },
    };
  });
}

export function transformCommentsSearch(comments: any[]) {
  return comments.map((comment) => {
    return {
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      edited_at: comment.edited_at,
      is_deleted: comment.is_deleted,
      upvote_count: comment.upvote_count,
      downvote_count: comment.downvote_count,
      total_vote_score: comment.total_vote_score,
      post_id: comment.post_id,
      user_id: comment.user_id,
      parent_comment_id: comment.parent_comment_id,
      post: {
        community: {
          name: comment.community_name,
          profile_picture_url: comment.community_profile_picture_url,
          type: comment.community_type,
        },
        id: comment.post_id,
        title: comment.post_title,
        created_at: comment.post_created_at,
        total_comment_score: comment.post_total_comment_score,
        total_vote_score: comment.post_total_vote_score,
        is_mature: comment.post_is_mature,
        is_spoiler: comment.post_is_spoiler,
      },
      user: {
        username: comment.username,
        profile_picture_url: comment.user_pfp,
        deleted_at: comment.user_deleted_at,
      },
    };
  });
}

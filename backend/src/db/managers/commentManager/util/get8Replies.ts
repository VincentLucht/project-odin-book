/**
 * Creates a nested comment include structure with specified depth.
 * @param depth The maximum depth of comment replies is 0-8 (9 comments total).
 */
export const createCommentInclude = (
  depth = 8,
  includeUserVotes = false,
  userId?: string,
): Record<string, any> => {
  // Reached maximum depth
  if (depth < 0) {
    return {};
  }

  // Standard fields
  const baseInclude = {
    user: {
      select: {
        username: true,
        profile_picture_url: true,
        deleted_at: true,
      },
    },
    ...(userId && {
      reports: { where: { reporter_id: userId } },
    }),
    comment_votes:
      includeUserVotes && userId
        ? {
            where: { user_id: userId },
            select: { user_id: true, vote_type: true },
          }
        : {
            select: { user_id: true, vote_type: true },
            where: { user_id: 'someuseridthatwillneverexist1234_2' }, // ensure empty array
          },
    moderation: {
      include: {
        moderator: {
          select: {
            user: { select: { username: true, profile_picture_url: true } },
          },
        },
      },
    },
    _count: { select: { replies: true } },
  };

  // Get more replies
  if (depth > 0) {
    return {
      ...baseInclude,
      replies: {
        include: createCommentInclude(depth - 1, includeUserVotes, userId),
      },
    };
  }

  return baseInclude;
};

/**
 * Returns the include structure for 8 levels of nested replies
 */
export const get8Replies = (userId?: string) => ({
  replies: {
    include: createCommentInclude(7, Boolean(userId), userId),
  },
});

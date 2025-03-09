export const get7Replies = {
  replies: {
    include: {
      user: { select: { username: true, profile_picture_url: true } },
      comment_votes: { select: { user_id: true, vote_type: true } },
      _count: { select: { replies: true } },
      replies: {
        include: {
          user: { select: { username: true, profile_picture_url: true } },
          comment_votes: { select: { user_id: true, vote_type: true } },
          _count: { select: { replies: true } },
          replies: {
            include: {
              user: { select: { username: true, profile_picture_url: true } },
              comment_votes: { select: { user_id: true, vote_type: true } },
              _count: { select: { replies: true } },
              replies: {
                include: {
                  user: {
                    select: { username: true, profile_picture_url: true },
                  },
                  comment_votes: { select: { user_id: true, vote_type: true } },
                  _count: { select: { replies: true } },
                  replies: {
                    include: {
                      user: {
                        select: { username: true, profile_picture_url: true },
                      },
                      comment_votes: {
                        select: { user_id: true, vote_type: true },
                      },
                      _count: { select: { replies: true } },
                      replies: {
                        include: {
                          user: {
                            select: {
                              username: true,
                              profile_picture_url: true,
                            },
                          },
                          comment_votes: {
                            select: { user_id: true, vote_type: true },
                          },
                          _count: { select: { replies: true } },
                          replies: {
                            include: {
                              user: {
                                select: {
                                  username: true,
                                  profile_picture_url: true,
                                },
                              },
                              comment_votes: {
                                select: { user_id: true, vote_type: true },
                              },
                              _count: { select: { replies: true } },
                              replies: {
                                include: {
                                  user: {
                                    select: {
                                      username: true,
                                      profile_picture_url: true,
                                    },
                                  },
                                  comment_votes: {
                                    select: { user_id: true, vote_type: true },
                                  },
                                  _count: { select: { replies: true } },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

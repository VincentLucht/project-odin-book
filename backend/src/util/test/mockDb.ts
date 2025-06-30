const mockDb = {
  user: {
    getById: jest.fn(),
    getByUsername: jest.fn(),
    getByEmail: jest.fn(),
    create: jest.fn(),
  },
  topic: {
    getAll: jest.fn().mockResolvedValue(['topic1', 'topic2']),
  },
  community: {
    doesExistById: jest.fn(),
    doesExistByName: jest.fn(),
    getById: jest.fn(),
    getByName: jest.fn(),
    isPrivate: jest.fn(),
    create: jest.fn(),
    isOwner: jest.fn(),
  },
  userCommunity: {
    isMember: jest.fn(),
    getById: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
  },
  communityModerator: {
    isMod: jest.fn(),
    getById: jest.fn(),
    delete: jest.fn(),
    makeMod: jest.fn(),
  },
  postModeration: {
    moderate: jest.fn(),
    updateModeration: jest.fn(),
    updatePostAsModerator: jest.fn(),
  },
  commentModeration: {
    moderate: jest.fn(),
    updateModeration: jest.fn(),
  },
  communityFlair: {
    doesExistByName: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  },
  bannedUsers: {
    isBanned: jest.fn(),
  },
  post: {
    getById: jest.fn(),
    getByIdAndModerator: jest.fn(),
    create: jest.fn(),
    edit: jest.fn(),
    getByIdAndCommunity: jest.fn(),
    getPopular: jest.fn(),
    getBy: jest.fn(),
  },
  postVote: {
    hasVoted: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  comment: {
    getById: jest.fn(),
    getByIdAndModeration: jest.fn(),
    create: jest.fn(),
    softDelete: jest.fn(),
    delete: jest.fn(),
    getCommentThreads: jest.fn(),
  },
  commentVote: {
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  postAssignedFlair: {
    getById: jest.fn(),
    hasPostFlair: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userAssignedFlair: {
    getById: jest.fn(),
    getUserFlairInCommunity: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  joinRequest: {
    hasRequested: jest.fn(),
    request: jest.fn(),
    delete: jest.fn(),
  },
  modMail: {
    sendMessage: jest.fn(),
  },
  approvedUser: {
    isApproved: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  savedPost: {
    isSaved: jest.fn(),
    save: jest.fn(),
    unsave: jest.fn(),
  },
  savedComment: {
    isSaved: jest.fn(),
    save: jest.fn(),
    unsave: jest.fn(),
  },
};

export default mockDb;

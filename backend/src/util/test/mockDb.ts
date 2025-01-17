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
  },
  userCommunity: {
    isMember: jest.fn(),
    getById: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
  },
  communityModerator: {
    isMod: jest.fn(),
    delete: jest.fn(),
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
    create: jest.fn(),
    edit: jest.fn(),
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
    create: jest.fn(),
    softDelete: jest.fn(),
    delete: jest.fn(),
  },
  commentVote: {
    getById: jest.fn(),
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
};

export default mockDb;

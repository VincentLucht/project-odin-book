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
    getByName: jest.fn(),
    isPrivate: jest.fn(),
    create: jest.fn(),
  },
  userCommunity: {
    isMember: jest.fn(),
    join: jest.fn(),
    leave: jest.fn(),
  },
  communityModerator: {
    isMod: jest.fn(),
    delete: jest.fn(),
  },
  communityFlair: {
    doesExist: jest.fn(),
    create: jest.fn(),
  },
  bannedUsers: {
    isBanned: jest.fn(),
  },
};

export default mockDb;

const mockDb = {
  topic: {
    getAll: jest.fn().mockResolvedValue(['topic1', 'topic2']),
  },
  community: {
    create: jest.fn(),
  },
  userCommunity: {
    join: jest.fn(),
    leave: jest.fn(),
  },
  communityModerator: {
    isMod: jest.fn(),
    delete: jest.fn(),
  },
};

export default mockDb;

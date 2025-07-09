import * as dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import express from 'express';
import router from '@/routes/router';

import db from '@/db/db';
import { mockUser, mockCommunity } from '@/util/test/testUtil';
import { generateToken } from '@/util/test/testUtil';
import assert from '@/util/test/assert';
import valErr from '@/util/test/validationErrors';

const app = express();
app.use(express.json());
app.use('', router);

jest.mock('@/db/db', () => {
  const actualMockDb = jest.requireActual('@/util/test/mockDb').default;
  return {
    __esModule: true,
    default: actualMockDb,
  };
});

import mockDb from '@/util/test/mockDb';

// prettier-ignore
describe('User community', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  const mockRequest = {
    ...mockCommunity,
    community_id: '1',
    user_id: mockUser.id,
    topics: ['topic1', 'topic2'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockDb.user.getById.mockResolvedValue(true);
    mockDb.community.doesExistById.mockResolvedValue(true);
    mockDb.userCommunity.isMember.mockResolvedValue(false);
    mockDb.community.isPrivate.mockResolvedValue(false);
    mockDb.bannedUsers.isBanned.mockResolvedValue(false);
  });

  describe('GET /community/members', () => {
  const sendRequest = (query: any) =>
    request(app)
      .get('/community/members')
      .set('Authorization', `Bearer ${token}`)
      .query(query);

  beforeEach(() => {
    mockDb.communityModerator.getById.mockResolvedValue({ is_active: true });
    mockDb.userCommunity.getMembers.mockResolvedValue({
      members: [{ id: 'user1' }],
      pagination: { nextCursor: null },
    });
  });

  it('should successfully fetch members', async () => {
    const response = await sendRequest({ cmId: '1', m: 'users' });
    assert.exp(response, 200, 'Successfully fetched members');
    expect(response.body.members).toBeDefined();
  });

  it('should reject if not a moderator', async () => {
    mockDb.communityModerator.getById.mockResolvedValue({ is_active: false });
    const response = await sendRequest({ cmId: '1', m: 'users' });
    assert.exp(response, 403, 'You are not a moderator');
  });

  it('should handle db error', async () => {
    mockDb.userCommunity.getMembers.mockRejectedValue(new Error('DB error'));
    const response = await sendRequest({ cmId: '1', m: 'users' });
    assert.dbError(response);
  });
});

describe('GET /community/members/search', () => {
  const sendRequest = (query: any) =>
    request(app)
      .get('/community/members/search')
      .set('Authorization', `Bearer ${token}`)
      .query(query);

  beforeEach(() => {
    mockDb.communityModerator.getById.mockResolvedValue({ is_active: true });
    mockDb.userCommunity.getMembersByName.mockResolvedValue([
      { id: 'user2', username: 'john' },
    ]);
  });

  it('should fetch members by name', async () => {
    const response = await sendRequest({
      cmId: '1',
      u: 'john',
      m: 'users',
    });

    assert.exp(response, 200, 'Successfully fetched members');
    expect(response.body.members).toHaveLength(1);
  });

  it('should return empty if no matches', async () => {
    mockDb.userCommunity.getMembersByName.mockResolvedValue(null);
    const response = await sendRequest({
      cmId: '1',
      u: 'nonexistent',
      m: 'users',
    });

    assert.exp(response, 200, 'Successfully fetched members');
    expect(response.body.members).toEqual([]);
  });

  it('should handle db error', async () => {
    mockDb.userCommunity.getMembersByName.mockRejectedValue(
      new Error('DB error'),
    );
    const response = await sendRequest({
      cmId: '1',
      u: 'john',
      m: 'users',
    });

    assert.dbError(response);
  });
});

describe('GET /community/homepage', () => {
  const sendRequest = (query: any) =>
    request(app)
      .get('/community/homepage')
      .set('Authorization', `Bearer ${token}`)
      .query(query);

  beforeEach(() => {
    mockDb.userCommunity.fetchHomePageBy.mockResolvedValue({
      homepage: [{ id: 'post1' }],
      pagination: { nextCursor: null },
    });
  });

  it('should fetch homepage posts', async () => {
    const response = await sendRequest({
      sbt: 'new',
      t: 'DAY',
      cId: '',
    });

    assert.exp(response, 200, 'Successfully fetched home page');
    expect(response.body.posts).toHaveLength(1);
  });

  it('should handle db error', async () => {
    mockDb.userCommunity.fetchHomePageBy.mockRejectedValue(
      new Error('DB error'),
    );
    const response = await sendRequest({
      sbt: 'top',
      t: 'WEEK',
      cId: '',
    });

    assert.dbError(response);
  });
});

describe('GET /community/joined-communities', () => {
  const sendRequest = (query: any = {}) =>
    request(app)
      .get('/community/joined-communities')
      .set('Authorization', `Bearer ${token}`)
      .query(query);

  beforeEach(() => {
    mockDb.userCommunity.getJoinedCommunities.mockResolvedValue([
      { id: 'community1', name: 'test' },
    ]);
  });

  it('should fetch joined communities', async () => {
    const response = await sendRequest({ page: 1, limit: 15 });

    assert.exp(response, 201, 'Successfully fetched joined communities');
    expect(response.body.joinedCommunities).toHaveLength(1);
  });

  it('should handle db error', async () => {
    mockDb.userCommunity.getJoinedCommunities.mockRejectedValue(
      new Error('DB error'),
    );
    const response = await sendRequest();

    assert.dbError(response);
  });
});

  describe('POST /community/join', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/join')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully join a community', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully joined community');
      });

      it('should allow approved user to join private community', async () => {
        mockDb.community.isPrivate.mockResolvedValue(true);
        mockDb.approvedUser.isApproved.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully joined community');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.doesExistById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user already being part of community', async () => {
        mockDb.userCommunity.isMember.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.userCommunity.isMember(response);
      });

      it('should not allow joining private community', async () => {
        mockDb.community.isPrivate.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, "You can't join a private community");
      });

      it('should not allow banned user joining', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject(valErr.missingCommunityId());
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });

  describe('DELETE /community/leave', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .delete('/community/leave')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully leave a community', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        mockDb.userCommunity.isMember.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully left community');
        expect(db.userCommunity.leave).toHaveBeenCalled();
      });

      it('should successfully leave a community and remove your mod status', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(true);
        mockDb.userCommunity.isMember.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully left community');
        expect(db.communityModerator.deactivateMod).toHaveBeenCalled();
        expect(db.userCommunity.leave).toHaveBeenCalled();
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.doesExistById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle a user not being inside a community', async () => {
        mockDb.userCommunity.isMember.mockResolvedValueOnce(false);
        const response = await sendRequest(mockRequest);

        assert.userCommunity.isNotMember(response);
      });

      it('should handle preventing an owner trying to leave', async () => {
        mockDb.userCommunity.isMember.mockResolvedValueOnce(true);
        mockDb.community.isOwner.mockResolvedValueOnce(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'As the owner, you can not leave a community');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject(valErr.missingCommunityId());
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

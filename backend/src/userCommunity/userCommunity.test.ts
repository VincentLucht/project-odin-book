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
describe('/community', () => {
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
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.userCommunity.isNotMember(response);
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

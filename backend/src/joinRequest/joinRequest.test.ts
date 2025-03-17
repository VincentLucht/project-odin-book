import * as dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import express from 'express';
import router from '@/routes/router';

import { mockUser } from '@/util/test/testUtil';
import { generateToken } from '@/util/test/testUtil';
import assert from '@/util/test/assert';

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
describe('/community/post/comment/vote', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/join-request', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
      mockDb.joinRequest.hasRequested.mockResolvedValue(false);
      mockDb.userCommunity.isMember.mockResolvedValue(false);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
    });

    const mockRequest = {
      community_id: '1',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/join-request')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully send a join request', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully sent join request');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle community not being private', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PUBLIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, "You can't send a join request for a non private community");
      });

      it('should handle user already having sent a request', async () => {
        mockDb.joinRequest.hasRequested.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You have already sent a join request');
      });

      it('should handle user already being a member', async () => {
        mockDb.userCommunity.isMember.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'You are already a member of this community');
      });

      it('should handle user being banned from community', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          'errors': [
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Community ID is required',
                  'path': 'community_id',
                  'location': 'body',
              },
          ],
      });
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });

  describe('DELETE /community/join-request', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE', id: '1' });
      mockDb.joinRequest.hasRequested.mockResolvedValue(true);
      mockDb.userCommunity.isMember.mockResolvedValue(false);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
    });

    const mockRequest = {
      community_id: '1',
    };

    const deleteRequest = (body: any) => {
      return request(app)
        .delete('/community/join-request')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Error cases', () => {
      it('should handle community not being private', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PUBLIC', id: '1' });
        const response = await deleteRequest(mockRequest);
        assert.exp(response, 400, "You can't delete a join request for a non private community");
      });

      it('should handle join request not existing', async () => {
        mockDb.joinRequest.hasRequested.mockResolvedValue(false);
        const response = await deleteRequest(mockRequest);
        assert.exp(response, 403, 'No join request found');
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await deleteRequest(mockRequest);
        assert.dbError(response);
      });
    });
  });
});

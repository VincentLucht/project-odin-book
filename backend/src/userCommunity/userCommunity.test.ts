import * as dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import express from 'express';
import router from '@/routes/router';

import mockChecker from '@/util/test/checker/mockChecker';
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
jest.mock('bcrypt');
jest.mock('@/util/checker/checker');

import mockDb from '@/util/test/mockDb';

// prettier-ignore
describe('POST /community', () => {
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
    mockDb.topic.getAll.mockResolvedValue(['topic1', 'topic2']);
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
        mockChecker.user.notFoundById();
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockChecker.community.notFoundById();
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user already being part of community', async () => {
        mockChecker.userCommunity.isMember();
        const response = await sendRequest(mockRequest);

        assert.userCommunity.isMember(response);
      });

      it('should not allow joining private community', async () => {
        mockChecker.community.isPrivate();
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'Can not join private community');
      });

      it('should not allow banned user joining', async () => {
        mockChecker.bannedUsers.isBanned();
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, "Can't join community when banned");
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject(valErr.missingCommunityId());
      });

      it('should handle db error', async () => {
        mockChecker.dbError.user.notFoundById();
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

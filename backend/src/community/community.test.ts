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
describe('POST /community', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  const mockRequest = {
    ...mockCommunity,
    user_id: mockUser.id,
    topics: ['topic1', 'topic2'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockDb.user.getById.mockResolvedValue(true);
    mockDb.community.doesExistByName.mockResolvedValue(false);
    mockDb.topic.getAll.mockResolvedValue(['topic1', 'topic2']);
  });

  describe('POST /sign-up', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/community')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it(
        'should create a community with an owner, name, description, not private, not mature, public type, and 2 valid topics',
        async () => {
          const response = await sendRequest(mockRequest);

          assert.exp(response, 201, 'Successfully created community');
          expect(db.community.create).toHaveBeenCalled();
        });
    });

    describe('Error cases', () => {
      it('should handle a name already being used', async () => {
        mockDb.community.doesExistByName.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'Community Name already in use');
      });

      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle incorrect topics', async () => {
        const response = await sendRequest({ ...mockRequest, topics: ['nothing'] });

        expect(response.body).toMatchObject(valErr.invalidTopic('nothing'));
      });

      it('should handle incorrect types', async () => {
        const response = await sendRequest({ ...mockRequest, type: 'invalidType' });

        expect(response.body).toMatchObject(valErr.invalidType());
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject(valErr.missingCommunity());
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

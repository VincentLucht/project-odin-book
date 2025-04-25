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

// TODO: Not that important, but there are no tests
jest.mock('@/db/db', () => {
  const actualMockDb = jest.requireActual('@/util/test/mockDb').default;
  return {
    __esModule: true,
    default: actualMockDb,
  };
});

import mockDb from '@/util/test/mockDb';

// prettier-ignore
describe('/modmail', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  const mockRequest = {
    community_id: '1',
    subject: 'test subject',
    message: 'test message',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockDb.user.getById.mockResolvedValue(true);
    mockDb.community.getById.mockResolvedValue(true);
  });

  describe('POST /modmail', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/modmail')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully create a message', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully sent message');
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

        assert.community.notFound(response);
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({ 'errors': [{ 'type': 'field', 'value': '', 'msg': 'Subject must be at least 1 characters long', 'path': 'subject', 'location': 'body' }, { 'type': 'field', 'value': '', 'msg': 'Message must be at least 1 characters long', 'path': 'message', 'location': 'body' }, { 'type': 'field', 'value': '', 'msg': 'Community ID is required', 'path': 'community_id', 'location': 'body' }] });
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

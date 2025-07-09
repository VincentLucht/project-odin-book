import * as dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import express from 'express';
import router from '@/routes/router';
import { generateToken } from '@/util/test/testUtil';

import db from '@/db/db';
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

jest.mock('@/db/db');
jest.mock('bcrypt');

import mockDb from '@/util/test/mockDb';

describe('Message', () => {
  const mockUser = {
    id: 'user1',
    username: 'testuser',
  };
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockDb.user.getById.mockResolvedValue(true);
    mockDb.userChat.isMemberById.mockResolvedValue(true);
  });

  describe('POST /chat/message', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/chat/message')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should send a message', async () => {
        const mockSentMessage = {
          id: 'message1',
          content: 'Hello world',
          user_id: mockUser.id,
        };
        mockDb.message.send.mockResolvedValue(mockSentMessage);

        const response = await sendRequest({
          chat_id: 'chat1',
          content: 'Hello world',
        });

        assert.exp(response, 201, 'Successfully sent message');
        expect(response.body.sentMessage).toEqual(mockSentMessage);
        expect(db.message.send).toHaveBeenCalledWith(
          'chat1',
          mockUser.id,
          'Hello world',
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not found', async () => {
        mockDb.user.getById.mockResolvedValue(null);

        const response = await sendRequest({
          chat_id: 'chat1',
          content: 'Hello world',
        });

        assert.exp(response, 404, 'User not found');
        expect(db.message.send).not.toHaveBeenCalled();
      });

      it('should handle user not member of chat', async () => {
        mockDb.userChat.isMemberById.mockResolvedValue(false);

        const response = await sendRequest({
          chat_id: 'chat1',
          content: 'Hello world',
        });

        assert.exp(response, 403, 'You are not a member of this chat');
        expect(db.message.send).not.toHaveBeenCalled();
      });

      it('should handle db error', async () => {
        mockDb.message.send.mockRejectedValue(new Error('DB error'));

        const response = await sendRequest({
          chat_id: 'chat1',
          content: 'Hello world',
        });

        assert.dbError(response);
      });
    });
  });
});

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

// prettier-ignore
describe('Chat', () => {
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
    mockDb.chat.getById.mockResolvedValue({ id: 'chat1', is_group_chat: false });
  });

  describe('POST /chat', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/chat')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should create a chat', async () => {
        const mockUser2 = { id: 'user2', username: 'user2' };
        const mockCreatedChat = { id: 'chat1', members: ['user1', 'user2'] };

        mockDb.user.getByUsername.mockResolvedValue(mockUser2);
        mockDb.chat.doesExist_1on1.mockResolvedValue(false);
        mockDb.chat.canCreateChat.mockResolvedValue(true);
        mockDb.chat.create.mockResolvedValue(mockCreatedChat);

        const response = await sendRequest({ user2_username: 'user2' });

        assert.exp(response, 201, 'Successfully created chat');
        expect(response.body.chat).toEqual(mockCreatedChat);
        expect(db.chat.create).toHaveBeenCalledWith(mockUser.id, 'user2', '', false, '', '');
      });
    });

    describe('Error cases', () => {
      it('should handle user not found', async () => {
        mockDb.user.getById.mockResolvedValue(null);

        const response = await sendRequest({ user2_username: 'user2' });

        assert.exp(response, 404, 'User not found');
        expect(db.chat.create).not.toHaveBeenCalled();
      });

      it('should handle target user not found', async () => {
        mockDb.user.getByUsername.mockResolvedValue(null);

        const response = await sendRequest({ user2_username: 'nonexistent' });

        assert.exp(response, 404, 'User not found');
        expect(db.chat.create).not.toHaveBeenCalled();
      });

      it('should handle trying to create chat with yourself', async () => {
        const mockUser2 = { id: 'user2', username: mockUser.username };
        mockDb.user.getByUsername.mockResolvedValue(mockUser2);

        const response = await sendRequest({ user2_username: mockUser.username });

        assert.exp(response, 409, 'You can not create a chat with yourself');
        expect(db.chat.create).not.toHaveBeenCalled();
      });

      it('should handle chat already exists', async () => {
        const mockUser2 = { id: 'user2', username: 'user2' };
        mockDb.user.getByUsername.mockResolvedValue(mockUser2);
        mockDb.chat.doesExist_1on1.mockResolvedValue(true);

        const response = await sendRequest({ user2_username: 'user2' });

        assert.exp(response, 409, 'Chat already exists');
        expect(db.chat.create).not.toHaveBeenCalled();
      });

      it('should handle user disabled chat requests', async () => {
        const mockUser2 = { id: 'user2', username: 'user2' };
        mockDb.user.getByUsername.mockResolvedValue(mockUser2);
        mockDb.chat.doesExist_1on1.mockResolvedValue(false);
        mockDb.chat.canCreateChat.mockResolvedValue(false);

        const response = await sendRequest({ user2_username: 'user2' });

        assert.exp(response, 403, 'This user disabled chat requests');
        expect(db.chat.create).not.toHaveBeenCalled();
      });

      it('should handle db error', async () => {
        mockDb.user.getByUsername.mockRejectedValue(new Error('DB error'));

        const response = await sendRequest({ user2_username: 'user2' });

        assert.dbError(response);
      });
    });
  });

  describe('POST /chat/read', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/chat/read')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should mark chat as read', async () => {
        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 200, 'Successfully read chat');
        expect(db.userChat.read).toHaveBeenCalledWith(mockUser.id, 'chat1');
      });
    });

    describe('Error cases', () => {
      it('should handle user not found', async () => {
        mockDb.user.getById.mockResolvedValue(null);

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 404, 'User not found');
        expect(db.userChat.read).not.toHaveBeenCalled();
      });

      it('should handle user not member of chat', async () => {
        mockDb.userChat.isMemberById.mockResolvedValue(false);

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 403, 'You are not a member of this chat');
        expect(db.userChat.read).not.toHaveBeenCalled();
      });

      it('should handle db error', async () => {
        mockDb.userChat.read.mockRejectedValue(new Error('DB error'));

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.dbError(response);
      });
    });
  });

  describe('PUT /chat/mute', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .put('/chat/mute')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should mute chat', async () => {
        const response = await sendRequest({ chat_id: 'chat1', is_muted: true });

        assert.exp(response, 200, 'Successfully muted chat');
        expect(db.userChat.muteChat).toHaveBeenCalledWith('chat1', mockUser.id, true);
      });

      it('should unmute chat', async () => {
        const response = await sendRequest({ chat_id: 'chat1', is_muted: false });

        assert.exp(response, 200, 'Successfully muted chat');
        expect(db.userChat.muteChat).toHaveBeenCalledWith('chat1', mockUser.id, false);
      });
    });

    describe('Error cases', () => {
      it('should handle user not found', async () => {
        mockDb.user.getById.mockResolvedValue(null);

        const response = await sendRequest({ chat_id: 'chat1', is_muted: true });

        assert.exp(response, 404, 'User not found');
        expect(db.userChat.muteChat).not.toHaveBeenCalled();
      });

      it('should handle user not member of chat', async () => {
        mockDb.userChat.isMemberById.mockResolvedValue(false);

        const response = await sendRequest({ chat_id: 'chat1', is_muted: true });

        assert.exp(response, 403, 'You are not a member of this chat');
        expect(db.userChat.muteChat).not.toHaveBeenCalled();
      });

      it('should handle db error', async () => {
        mockDb.userChat.muteChat.mockRejectedValue(new Error('DB error'));

        const response = await sendRequest({ chat_id: 'chat1', is_muted: true });

        assert.dbError(response);
      });
    });
  });

  describe('DELETE /chat', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .delete('/chat')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should leave chat with remaining members', async () => {
        mockDb.userChat.leave.mockResolvedValue(2); // 2 remaining members

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 200, 'Successfully left chat');
        expect(db.userChat.leave).toHaveBeenCalledWith('chat1', mockUser.id, mockUser.username, false);
        expect(db.message.send).toHaveBeenCalledWith('chat1', 'system_id', `u/${mockUser.username} left the chat`);
      });

      it('should leave chat with no remaining members', async () => {
        mockDb.userChat.leave.mockResolvedValue(0); // no remaining members

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 200, 'Successfully left chat');
        expect(db.userChat.leave).toHaveBeenCalledWith('chat1', mockUser.id, mockUser.username, false);
        expect(db.message.send).not.toHaveBeenCalled();
      });
    });

    describe('Error cases', () => {
      it('should handle user not found', async () => {
        mockDb.user.getById.mockResolvedValue(null);

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 404, 'User not found');
        expect(db.userChat.leave).not.toHaveBeenCalled();
      });

      it('should handle chat not found', async () => {
        mockDb.chat.getById.mockResolvedValue(null);

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 404, 'Chat not found');
        expect(db.userChat.leave).not.toHaveBeenCalled();
      });

      it('should handle user not member of chat', async () => {
        mockDb.userChat.isMemberById.mockResolvedValue(false);

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.exp(response, 403, 'You are not a member of this chat');
        expect(db.userChat.leave).not.toHaveBeenCalled();
      });

      it('should handle db error', async () => {
        mockDb.userChat.leave.mockRejectedValue(new Error('DB error'));

        const response = await sendRequest({ chat_id: 'chat1' });

        assert.dbError(response);
      });
    });
  });
});

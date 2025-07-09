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

        expect(response.body).toMatchObject({
          'errors': [
            { 'type': 'field', 'value': '', 'msg': 'Subject must be at least 1 characters long', 'path': 'subject', 'location': 'body' },
            { 'type': 'field', 'value': '', 'msg': 'Message must be at least 1 characters long', 'path': 'message', 'location': 'body' },
            { 'type': 'field', 'value': '', 'msg': 'Community ID is required', 'path': 'community_id', 'location': 'body' },
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

  describe('POST /modmail/reply', () => {
    const mockReplyRequest = {
      subject: 'Re: test subject',
      message: 'test reply message',
      modmail_id: '1',
    };

    const mockModmail = {
      id: '1',
      community_id: '1',
      sender_id: 'user123',
      subject: 'test subject',
      message: 'test message',
      replied: false,
      archived: false,
    };

    const sendReplyRequest = (body: any) => {
      return request(app)
        .post('/modmail/reply')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    beforeEach(() => {
      mockDb.modMail.getById.mockResolvedValue(mockModmail);
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.modMail.update.mockResolvedValue(true);
      mockDb.notification.send.mockResolvedValue(true);
    });

    describe('Success cases', () => {
      it('should successfully reply to a modmail', async () => {
        const response = await sendReplyRequest(mockReplyRequest);
        assert.exp(response, 201, 'Successfully replied to mod mail');

        // Verify the modmail was updated to replied: true
        expect(mockDb.modMail.update).toHaveBeenCalledWith(mockReplyRequest.modmail_id, { replied: true });

        // Verify notification was sent
        expect(mockDb.notification.send).toHaveBeenCalledWith(
          'community',
          mockModmail.community_id,
          mockModmail.sender_id,
          'MODMAILREPLY',
          mockReplyRequest.subject,
          mockReplyRequest.message,
          mockModmail.id,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendReplyRequest(mockReplyRequest);

        assert.user.notFound(response);
      });

      it('should handle modmail not found', async () => {
        mockDb.modMail.getById.mockResolvedValue(null);
        const response = await sendReplyRequest(mockReplyRequest);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Mod mail was not found');
      });

      it('should handle community not found', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendReplyRequest(mockReplyRequest);

        assert.community.notFound(response);
      });

      it('should handle user not being a moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendReplyRequest(mockReplyRequest);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You are not moderator in this community');
      });

      it('should handle missing inputs', async () => {
        const response = await sendReplyRequest({});

        expect(response.body).toMatchObject({
          'errors': [
            { 'type': 'field', 'value': '', 'msg': 'Subject must be at least 1 characters long', 'path': 'subject', 'location': 'body' },
            { 'type': 'field', 'value': '', 'msg': 'Message must be at least 1 characters long', 'path': 'message', 'location': 'body' },
            { 'type': 'field', 'value': '', 'msg': 'Mod mail is required', 'path': 'modmail_id', 'location': 'body' },
          ],
        });
      });

      it('should handle db error when getting modmail', async () => {
        mockDb.modMail.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendReplyRequest(mockReplyRequest);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to reply to mod mail');
      });

      it('should handle db error when updating modmail', async () => {
        mockDb.modMail.update.mockRejectedValue(new Error('DB error'));
        const response = await sendReplyRequest(mockReplyRequest);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to reply to mod mail');
      });

      it('should handle db error when sending notification', async () => {
        mockDb.notification.send.mockRejectedValue(new Error('DB error'));
        const response = await sendReplyRequest(mockReplyRequest);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to reply to mod mail');
      });
    });
  });

  describe('PUT /modmail', () => {
    const mockUpdateRequest = {
      modmail_id: '1',
      archived: true,
      replied: false,
    };

    const mockModmail = {
      id: '1',
      community_id: '1',
      sender_id: 'user123',
      subject: 'test subject',
      message: 'test message',
      replied: false,
      archived: false,
    };

    const sendUpdateRequest = (body: any) => {
      return request(app)
        .put('/modmail')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    beforeEach(() => {
      mockDb.modMail.getById.mockResolvedValue(mockModmail);
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.modMail.update.mockResolvedValue(true);
    });

    describe('Success cases', () => {
      it('should successfully update modmail with archived flag', async () => {
        const response = await sendUpdateRequest(mockUpdateRequest);
        assert.exp(response, 201, 'Successfully updated mod mail');

        // Verify modmail was updated with correct values
        expect(mockDb.modMail.update).toHaveBeenCalledWith(mockUpdateRequest.modmail_id, {
          archived: mockUpdateRequest.archived,
          replied: mockUpdateRequest.replied,
        });
      });

      it('should successfully update modmail with replied flag', async () => {
        const updateRequest = {
          modmail_id: '1',
          archived: false,
          replied: true,
        };

        const response = await sendUpdateRequest(updateRequest);
        assert.exp(response, 201, 'Successfully updated mod mail');

        expect(mockDb.modMail.update).toHaveBeenCalledWith(updateRequest.modmail_id, {
          archived: updateRequest.archived,
          replied: updateRequest.replied,
        });
      });

      it('should successfully update modmail with both flags', async () => {
        const updateRequest = {
          modmail_id: '1',
          archived: true,
          replied: true,
        };

        const response = await sendUpdateRequest(updateRequest);
        assert.exp(response, 201, 'Successfully updated mod mail');

        expect(mockDb.modMail.update).toHaveBeenCalledWith(updateRequest.modmail_id, {
          archived: updateRequest.archived,
          replied: updateRequest.replied,
        });
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendUpdateRequest(mockUpdateRequest);

        assert.user.notFound(response);
      });

      it('should handle modmail not found', async () => {
        mockDb.modMail.getById.mockResolvedValue(null);
        const response = await sendUpdateRequest(mockUpdateRequest);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Mod mail was not found');
      });

      it('should handle community not found', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendUpdateRequest(mockUpdateRequest);

        assert.community.notFound(response);
      });

      it('should handle user not being a moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendUpdateRequest(mockUpdateRequest);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You are not moderator in this community');
      });

      it('should handle missing modmail_id', async () => {
        const response = await sendUpdateRequest({ archived: true, replied: false });

        expect(response.body.errors).toMatchObject([{ 'location': 'body', 'msg': 'Mod mail is required', 'path': 'modmail_id', 'type': 'field', 'value': '' }]);
      });

      it('should handle invalid archived value', async () => {
        const response = await sendUpdateRequest({
          modmail_id: '1',
          archived: 'invalid',
          replied: false,
        });

        expect(response.body).toMatchObject({
          'errors': [
            { 'type': 'field', 'value': 'invalid', 'msg': 'Invalid value', 'path': 'archived', 'location': 'body' },
          ],
        });
      });

      it('should handle invalid replied value', async () => {
        const response = await sendUpdateRequest({
          modmail_id: '1',
          archived: false,
          replied: 'invalid',
        });

        expect(response.body).toMatchObject({
          'errors': [
            { 'type': 'field', 'value': 'invalid', 'msg': 'Invalid value', 'path': 'replied', 'location': 'body' },
          ],
        });
      });

      it('should handle db error when getting modmail', async () => {
        mockDb.modMail.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendUpdateRequest(mockUpdateRequest);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to update mod mail');
      });

      it('should handle db error when updating modmail', async () => {
        mockDb.modMail.update.mockRejectedValue(new Error('DB error'));
        const response = await sendUpdateRequest(mockUpdateRequest);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to update mod mail');
      });

      it('should handle partial update with only archived', async () => {
        const partialRequest = {
          modmail_id: '1',
          archived: true,
        };

        const response = await sendUpdateRequest(partialRequest);
        assert.exp(response, 201, 'Successfully updated mod mail');

        expect(mockDb.modMail.update).toHaveBeenCalledWith(partialRequest.modmail_id, {
          archived: partialRequest.archived,
          replied: undefined,
        });
      });

      it('should handle partial update with only replied', async () => {
        const partialRequest = {
          modmail_id: '1',
          replied: true,
        };

        const response = await sendUpdateRequest(partialRequest);
        assert.exp(response, 201, 'Successfully updated mod mail');

        expect(mockDb.modMail.update).toHaveBeenCalledWith(partialRequest.modmail_id, {
          archived: undefined,
          replied: partialRequest.replied,
        });
      });
    });
  });
});

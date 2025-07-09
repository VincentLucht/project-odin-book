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
describe('Notifications', () => {
  const token = generateToken(mockUser.id, mockUser.username);
  const mockNotification = {
    id: '1',
    receiver_id: mockUser.id,
    sender_id: '2',
    type: 'comment',
    message: 'Test notification',
    is_read: false,
    is_hidden: false,
    read_at: null,
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockDb.user.getById.mockResolvedValue(true);
    mockDb.notification.getById.mockResolvedValue(mockNotification);
  });

  describe('GET /notifications', () => {
    const sendRequest = (query: any = {}) => {
      return request(app)
        .get('/notification?sbt=all')
        .set('Authorization', `Bearer ${token}`)
        .query(query);
    };

    describe('Success cases', () => {
      it('should successfully fetch all notifications', async () => {
        const mockResponse = {
          notifications: [mockNotification],
          pagination: { hasMore: false, cursor: null },
        };
        mockDb.notification.fetchBy.mockResolvedValue(mockResponse);
        const response = await sendRequest();

        assert.exp(response, 200, 'Successfully fetched all notifications');
        expect(response.body.notifications).toEqual([mockNotification]);
        expect(response.body.pagination).toEqual(mockResponse.pagination);
      });

      it('should successfully fetch notifications with filters', async () => {
        const mockResponse = {
          notifications: [mockNotification],
          pagination: { hasMore: false, cursor: null },
        };
        mockDb.notification.fetchBy.mockResolvedValue(mockResponse);
        const response = await sendRequest({ iH: 'true', cId: '123' });

        assert.exp(response, 200, 'Successfully fetched all notifications');
        expect(mockDb.notification.fetchBy).toHaveBeenCalledWith(
          mockUser.id,
          'all',
          true,
          '123',
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest();

        assert.user.notFound(response);
      });

      it('should handle db error', async () => {
        mockDb.notification.fetchBy.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest();

        assert.exp(response, 500, 'Failed to fetch all notifications');
      });
    });
  });

  describe('GET /notifications/unread-status', () => {
    const sendRequest = () => {
      return request(app)
        .get('/notification/unread-status')
        .set('Authorization', `Bearer ${token}`);
    };

    describe('Success cases', () => {
      it('should successfully check unread notifications status', async () => {
        mockDb.notification.hasUnread.mockResolvedValue(true);
        const response = await sendRequest();

        expect(response.status).toBe(200);
        expect(response.body.hasUnreadNotifications).toBe(true);
      });

      it('should return false when no unread notifications', async () => {
        mockDb.notification.hasUnread.mockResolvedValue(false);
        const response = await sendRequest();

        expect(response.status).toBe(200);
        expect(response.body.hasUnreadNotifications).toBe(false);
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest();

        assert.user.notFound(response);
      });

      it('should handle db error', async () => {
        mockDb.notification.hasUnread.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest();

        assert.exp(response, 500, 'Failed to determine notification amount');
      });
    });
  });

  describe('PUT /notifications/read-all', () => {
    const sendRequest = () => {
      return request(app)
        .put('/notification/read-all')
        .set('Authorization', `Bearer ${token}`);
    };

    describe('Success cases', () => {
      it('should successfully mark all notifications as read', async () => {
        mockDb.notification.markAllAsRead.mockResolvedValue(undefined);
        const response = await sendRequest();

        assert.exp(response, 200, 'Successfully marked all notifications as read');
        expect(mockDb.notification.markAllAsRead).toHaveBeenCalledWith(mockUser.id);
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest();

        assert.user.notFound(response);
      });

      it('should handle db error', async () => {
        mockDb.notification.markAllAsRead.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest();

        assert.exp(response, 500, 'Failed to mark all notifications as read');
      });
    });
  });

  describe('PUT /notifications/open', () => {
    const sendRequest = () => {
      return request(app)
        .put('/notification/open')
        .set('Authorization', `Bearer ${token}`);
    };

    describe('Success cases', () => {
      it('should successfully open all notifications', async () => {
        mockDb.notification.openAll.mockResolvedValue(undefined);
        const response = await sendRequest();

        assert.exp(response, 200, 'Successfully opened all notifications');
        expect(mockDb.notification.openAll).toHaveBeenCalledWith(mockUser.id);
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest();

        assert.user.notFound(response);
      });

      it('should handle db error', async () => {
        mockDb.notification.openAll.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest();

        assert.exp(response, 500, 'Failed to open all notifications');
      });
    });
  });

  describe('PUT /notifications/read', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .put('/notification/read')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully read a notification', async () => {
        mockDb.notification.read.mockResolvedValue(undefined);

        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 200, 'Successfully read notification');
        expect(mockDb.notification.read).toHaveBeenCalledWith(mockUser.id, '1');
      });

      it('should handle already read notification', async () => {
        mockDb.notification.getById.mockResolvedValue({
          ...mockNotification,
          read_at: new Date().toISOString(),
        });

        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 200, 'This notification is already read');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest({ notification_id: '1' });
        assert.user.notFound(response);
      });

      it('should handle notification not existing', async () => {
        mockDb.notification.getById.mockResolvedValue(null);
        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 404, 'Notification not found');
      });

      it('should handle incorrect user ID', async () => {
        mockDb.notification.getById.mockResolvedValue({
          ...mockNotification,
          receiver_id: 'different_user',
        });

        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 403, 'Incorrect user ID');
      });

      it('should handle db error', async () => {
        mockDb.notification.read.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 500, 'Failed to read notification');
      });
    });
  });

  describe('PUT /notifications/hide', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .put('/notification/hide')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully hide a notification', async () => {
        mockDb.notification.hide.mockResolvedValue(undefined);

        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 200, 'Successfully read notification');
        expect(mockDb.notification.hide).toHaveBeenCalledWith(
          mockUser.id,
          '1',
          !mockNotification.is_hidden,
        );
      });

      it('should successfully unhide a notification', async () => {
        mockDb.notification.getById.mockResolvedValue({
          ...mockNotification,
          is_hidden: true,
        });
        mockDb.notification.hide.mockResolvedValue(undefined);

        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 200, 'Successfully read notification');
        expect(mockDb.notification.hide).toHaveBeenCalledWith(
          mockUser.id,
          '1',
          false,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest({ notification_id: '1' });
        assert.user.notFound(response);
      });

      it('should handle notification not existing', async () => {
        mockDb.notification.getById.mockResolvedValue(null);
        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 404, 'Notification not found');
      });

      it('should handle incorrect user ID', async () => {
        mockDb.notification.getById.mockResolvedValue({
          ...mockNotification,
          receiver_id: 'different_user',
        });

        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 403, 'Incorrect user ID');
      });

      it('should handle db error', async () => {
        mockDb.notification.hide.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest({ notification_id: '1' });
        assert.exp(response, 500, 'Failed to read notification');
      });
    });
  });
});

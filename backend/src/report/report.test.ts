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

describe('Reports', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('GET /report', () => {
    const mockQueryParams = {
      cn: 'test-community',
      t: 'all',
      s: 'pending',
      sbt: 'new',
      ls: '100',
      ld: '2024-01-01',
      cId: '1',
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getByName.mockResolvedValue({
        id: '1',
        name: 'test-community',
      });
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.report.getBy.mockResolvedValue({
        reports: [],
        pagination: { hasNext: false },
      });
    });

    const sendRequest = (query: any) => {
      return request(app)
        .get('/report')
        .query(query)
        .set('Authorization', `Bearer ${token}`);
    };

    describe('Success cases', () => {
      it('should successfully fetch reports', async () => {
        const response = await sendRequest(mockQueryParams);

        assert.exp(response, 200, 'Successfully fetched reports');
        expect(response.body.reports).toBeDefined();
        expect(response.body.pagination).toBeDefined();
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockQueryParams);

        assert.user.notFound(response);
      });

      it('should handle community not found', async () => {
        mockDb.community.getByName.mockResolvedValue(null);
        const response = await sendRequest(mockQueryParams);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle user not being moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest(mockQueryParams);

        assert.exp(response, 403, 'You are not moderator in this community');
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockQueryParams);

        assert.dbError(response);
      });
    });
  });

  describe('POST /report', () => {
    const mockRequest = {
      type: 'POST',
      item_id: '1',
      subject: 'Spam content',
      reason: 'This post contains spam',
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue({ id: '1', community_id: '1' });
      mockDb.report.alreadyReported.mockResolvedValue(false);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.report.report.mockResolvedValue({ id: '1', ...mockRequest });
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/report')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully report a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully reported Post');
        expect(response.body.report).toBeDefined();
      });

      it('should successfully report a comment', async () => {
        mockDb.comment.getByIdAndCommunityId.mockResolvedValue({
          id: '1',
          community_id: '1',
        });

        const response = await sendRequest({ ...mockRequest, type: 'COMMENT' });

        assert.exp(response, 201, 'Successfully reported Comment');
        expect(response.body.report).toBeDefined();
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle post not found', async () => {
        mockDb.post.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Post not found');
      });

      it('should handle comment not found', async () => {
        mockDb.comment.getByIdAndCommunityId.mockResolvedValue(null);
        const response = await sendRequest({ ...mockRequest, type: 'COMMENT' });

        assert.exp(response, 404, 'Comment not found');
      });

      it('should handle already reported item', async () => {
        mockDb.report.alreadyReported.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You already reported this Post');
      });

      it('should handle banned user', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: expect.any(String),
              path: 'type',
            }),
            expect.objectContaining({
              msg: expect.any(String),
              path: 'item_id',
            }),
            expect.objectContaining({
              msg: expect.any(String),
              path: 'subject',
            }),
            expect.objectContaining({
              msg: expect.any(String),
              path: 'reason',
            }),
          ]),
        );
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

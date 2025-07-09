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
describe('Comment moderation', () => {
  const token = generateToken(mockUser.id, mockUser.username);
  const mockRequest = {
    comment_id: '1',
    reason: 'Community Violation',
    moderation_action: 'REMOVED',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/mod/post', () => {
    const moderatorId = 'mod-123';

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.comment.getByIdAndModeration.mockResolvedValue({ id: '1', post: { community_id: '1' } });
      mockDb.communityModerator.getById.mockResolvedValue({ id: 'mod-123', is_active: 'true' });
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/mod/comment')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully create comment moderation', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully moderated comment');
        expect(mockDb.commentModeration.moderate).toHaveBeenCalledWith(
          mockRequest.comment_id,
          moderatorId,
          mockRequest.moderation_action,
        );
      });

      it('should successfully update comment moderation', async () => {
        mockDb.comment.getByIdAndModeration.mockResolvedValue({
          id: '1',
          post: { community_id: '1' },
          moderation: {
            moderator_id: moderatorId,
          },
        });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated comment moderation');
        expect(mockDb.commentModeration.updateModeration).toHaveBeenCalledWith(
          mockRequest.comment_id,
          'REMOVED',
          moderatorId,
          mockRequest.reason,
        );
      });

      it('should allow community owner to override moderation by another moderator', async () => {
        mockDb.comment.getByIdAndModeration.mockResolvedValue({
          id: '1',
          post: { community_id: '1' },
          moderation: {
            moderator_id: 'different-moderator-id',
          },
        });
        mockDb.community.isOwner.mockResolvedValue(true);

        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated comment moderation');
        expect(mockDb.community.isOwner).toHaveBeenCalledWith(
          mockUser.id,
          '1',
        );
        expect(mockDb.commentModeration.updateModeration).toHaveBeenCalledWith(
          mockRequest.comment_id,
          'REMOVED',
          moderatorId,
          mockRequest.reason,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 404, 'User not found');
      });

      it('should handle comment not existing', async () => {
        mockDb.comment.getByIdAndModeration.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 404, 'Comment not found');
      });

      it('should handle user not being a mod', async () => {
        mockDb.communityModerator.getById.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle comment already being moderated by another user', async () => {
        mockDb.comment.getByIdAndModeration.mockResolvedValue({
          id: '1',
          post: { community_id: '1' },
          moderation: {
            moderator_id: 'different-moderator-id',
          },
        });
        mockDb.community.isOwner.mockResolvedValue(false);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 409, 'This comment was already moderated by another moderator');
      });

      it('should handle user being inactive mode', async () => {
        mockDb.communityModerator.getById.mockResolvedValue({ is_active: false });

        const response = await sendRequest(mockRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject(
          {
            'errors': [
                {
                    'type': 'field',
                    'value': '',
                    'msg': 'Post ID is required',
                    'path': 'comment_id',
                    'location': 'body',
                },
                {
                    'type': 'field',
                    'msg': 'Moderation action is required',
                    'path': 'moderation_action',
                    'location': 'body',
                },
            ],
        },
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

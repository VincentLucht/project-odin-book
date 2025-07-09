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
describe('Post moderation', () => {
  const token = generateToken(mockUser.id, mockUser.username);
  const mockRequest = {
    post_id: '1',
    reason: 'mock reason',
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
      mockDb.post.getByIdAndModerator.mockResolvedValue({
        id: '1',
        community_id: '2',
        poster_id: 'poster-123',
        title: 'Test Post',
        moderation: null,
      });
      mockDb.community.getById.mockResolvedValue({
        id: '2',
        name: 'TestCommunity',
      });
      mockDb.communityModerator.getById.mockResolvedValue({
        id: moderatorId,
        user_id: mockUser.id,
        community_id: '2',
        is_active: true,
      });
      mockDb.postModeration.moderate.mockResolvedValue(true);
      mockDb.postModeration.updateModeration.mockResolvedValue(true);
      mockDb.notification.send.mockResolvedValue(true);
      mockDb.report.updateAllPendingReports.mockResolvedValue(true);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/mod/post')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully create post moderation', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.postModeration.moderate).toHaveBeenCalledWith(
          mockRequest.post_id,
          moderatorId,
          mockRequest.moderation_action,
        );
      });

      it('should successfully update post moderation', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue({
          id: '1',
          community_id: '2',
          poster_id: 'poster-123',
          title: 'Test Post',
          moderation: {
            moderator_id: moderatorId,
          },
        });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated post moderation');
        expect(mockDb.postModeration.updateModeration).toHaveBeenCalledWith(
          mockRequest.post_id,
          'REMOVED',
          moderatorId,
          mockRequest.reason,
        );
      });

      it('should send notification when post is removed', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.notification.send).toHaveBeenCalledWith(
          'user',
          mockUser.id,
          'poster-123',
          'MODMESSAGE',
          'Removal of post Test Post in r/TestCommunity',
          'Your post "Test Post" in r/TestCommunity has been removed. Reason: mock reason',
          '1',
        );
      });

      it('should send default notification when post is removed without reason', async () => {
        const requestWithoutReason = {
          post_id: '1',
          moderation_action: 'REMOVED',
        };

        const response = await sendRequest(requestWithoutReason);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.notification.send).toHaveBeenCalledWith(
          'user',
          mockUser.id,
          'poster-123',
          'MODMESSAGE',
          'Removal of post Test Post in r/TestCommunity',
          'Your post "Test Post" was removed by the moderators of r/TestCommunity. If you think this was a mistake, you can message the moderators and try to appeal this decision.',
          '1',
        );
      });

      it('should not send notification when post is approved', async () => {
        const approveRequest = {
          post_id: '1',
          moderation_action: 'APPROVED',
        };

        const response = await sendRequest(approveRequest);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.notification.send).not.toHaveBeenCalled();
      });

      it('should update all pending reports', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.report.updateAllPendingReports).toHaveBeenCalledWith(
          mockRequest.post_id,
          moderatorId,
          'POST',
          'DISMISSED',
          undefined,
        );
      });

      it('should update pending reports with REVIEWED status when approved', async () => {
        const approveRequest = {
          post_id: '1',
          moderation_action: 'APPROVED',
        };

        const response = await sendRequest(approveRequest);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.report.updateAllPendingReports).toHaveBeenCalledWith(
          approveRequest.post_id,
          moderatorId,
          'POST',
          'REVIEWED',
          undefined,
        );
      });

      it('should pass dismiss_reason when provided', async () => {
        const requestWithDismissReason = {
          post_id: '1',
          moderation_action: 'REMOVED',
          dismiss_reason: 'spam',
        };

        const response = await sendRequest(requestWithDismissReason);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.report.updateAllPendingReports).toHaveBeenCalledWith(
          requestWithDismissReason.post_id,
          moderatorId,
          'POST',
          'DISMISSED',
          'spam',
        );
      });

      it('should return identical moderation action when same action and reason', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue({
          id: '1',
          community_id: '2',
          poster_id: 'poster-123',
          title: 'Test Post',
          moderation: {
            moderator_id: moderatorId,
            action: 'REMOVED',
            reason: 'mock reason',
          },
        });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Identical moderation action');
        expect(mockDb.postModeration.updateModeration).not.toHaveBeenCalled();
      });

      it('should return identical moderation action when same action and no reason', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue({
          id: '1',
          community_id: '2',
          poster_id: 'poster-123',
          title: 'Test Post',
          moderation: {
            moderator_id: moderatorId,
            action: 'APPROVED',
          },
        });

        const requestWithoutReason = {
          post_id: '1',
          moderation_action: 'APPROVED',
        };

        const response = await sendRequest(requestWithoutReason);

        assert.exp(response, 200, 'Identical moderation action');
        expect(mockDb.postModeration.updateModeration).not.toHaveBeenCalled();
      });

      it("should allow community owner to override another moderator's action", async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue({
          id: '1',
          community_id: '2',
          poster_id: 'poster-123',
          title: 'Test Post',
          moderation: {
            moderator_id: 'different-moderator-id',
          },
        });
        mockDb.community.isOwner.mockResolvedValue(true);

        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(200);
      });
    });

    it('should not send notification when poster_id is null', async () => {
      mockDb.post.getByIdAndModerator.mockResolvedValue({
        id: '1',
        community_id: '2',
        poster_id: null, // or undefined
        title: 'Test Post',
        moderation: null,
      });

      const response = await sendRequest(mockRequest);

      assert.exp(response, 201, 'Successfully moderated post');
      expect(mockDb.notification.send).not.toHaveBeenCalled();
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 404, 'User not found');
      });

      it('should handle post not existing', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 404, 'Post not found');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 404, 'Community not found');
      });

      it('should handle user not being a mod', async () => {
        mockDb.communityModerator.getById.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle post already being moderated by another mod', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue({
          id: '1',
          community_id: '2',
          poster_id: 'poster-123',
          title: 'Test Post',
          moderation: {
            moderator_id: 'different-moderator-id',
          },
        });
        mockDb.community.isOwner.mockResolvedValue(false);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 409, 'This post was already moderated by another moderator');
      });

      it('should handle user being inactive mode', async () => {
        mockDb.communityModerator.getById.mockResolvedValue({ is_active: false });

        const response = await sendRequest(mockRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          'errors': [
            {
              'type': 'field',
              'value': '',
              'msg': 'Post ID is required',
              'path': 'post_id',
              'location': 'body',
            },
            {
              'type': 'field',
              'msg': 'Moderation action is required',
              'path': 'moderation_action',
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

  describe('PUT /community/mod/post', () => {
    const moderatorId = 'mod-123';
    const updateRequest = {
      post_id: '1',
      is_mature: true,
      is_spoiler: false,
      lock_comments: true,
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getByIdAndModerator.mockResolvedValue({
        id: '1',
        community_id: '2',
      });
      mockDb.communityModerator.getById.mockResolvedValue({
        id: moderatorId,
        user_id: mockUser.id,
        community_id: '2',
        is_active: true,
      });
      mockDb.postModeration.updatePostAsModerator.mockResolvedValue(true);
    });

    const sendUpdateRequest = (body: any) => {
      return request(app)
        .put('/community/mod/post')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully update post with all fields', async () => {
        const response = await sendUpdateRequest(updateRequest);

        assert.exp(response, 201, 'Successfully updated post');
        expect(mockDb.postModeration.updatePostAsModerator).toHaveBeenCalledWith(
          updateRequest.post_id,
          {
            is_mature: true,
            is_spoiler: false,
            lock_comments: true,
          },
        );
      });

      it('should successfully update post with only is_mature', async () => {
        const partialRequest = {
          post_id: '1',
          is_mature: true,
        };

        const response = await sendUpdateRequest(partialRequest);

        assert.exp(response, 201, 'Successfully updated post');
        expect(mockDb.postModeration.updatePostAsModerator).toHaveBeenCalledWith(
          partialRequest.post_id,
          {
            is_mature: true,
            is_spoiler: undefined,
            lock_comments: undefined,
          },
        );
      });

      it('should successfully update post with only is_spoiler', async () => {
        const partialRequest = {
          post_id: '1',
          is_spoiler: true,
        };

        const response = await sendUpdateRequest(partialRequest);

        assert.exp(response, 201, 'Successfully updated post');
        expect(mockDb.postModeration.updatePostAsModerator).toHaveBeenCalledWith(
          partialRequest.post_id,
          {
            is_mature: undefined,
            is_spoiler: true,
            lock_comments: undefined,
          },
        );
      });

      it('should successfully update post with only lock_comments', async () => {
        const partialRequest = {
          post_id: '1',
          lock_comments: false,
        };

        const response = await sendUpdateRequest(partialRequest);

        assert.exp(response, 201, 'Successfully updated post');
        expect(mockDb.postModeration.updatePostAsModerator).toHaveBeenCalledWith(
          partialRequest.post_id,
          {
            is_mature: undefined,
            is_spoiler: undefined,
            lock_comments: false,
          },
        );
      });
    });

    describe('Error cases', () => {
      it('should handle no update fields provided', async () => {
        const emptyRequest = {
          post_id: '1',
        };

        const response = await sendUpdateRequest(emptyRequest);

        assert.exp(response, 400, 'At least one update field (is_mature, is_spoiler, or lock_comments) must be provided');
      });

      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);

        const response = await sendUpdateRequest(updateRequest);
        assert.exp(response, 404, 'User not found');
      });

      it('should handle post not existing', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue(null);

        const response = await sendUpdateRequest(updateRequest);
        assert.exp(response, 404, 'Post not found');
      });

      it('should handle user not being a mod', async () => {
        mockDb.communityModerator.getById.mockResolvedValue(null);

        const response = await sendUpdateRequest(updateRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle user being inactive moderator', async () => {
        mockDb.communityModerator.getById.mockResolvedValue({ is_active: false });

        const response = await sendUpdateRequest(updateRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle missing post_id', async () => {
        const requestWithoutPostId = {
          is_mature: true,
        };

        const response = await sendUpdateRequest(requestWithoutPostId);

        expect(response.body).toMatchObject({
          'errors': [
            {
              'type': 'field',
              'value': '',
              'msg': 'Post ID is required',
              'path': 'post_id',
              'location': 'body',
            },
          ],
        });
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendUpdateRequest(updateRequest);

        assert.dbError(response);
      });
    });
  });
});

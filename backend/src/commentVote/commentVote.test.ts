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
describe('Comment vote', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /comment/vote', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.comment.getById.mockResolvedValue({
        id: '1',
        user_id: 'comment_author_id',
        post_id: 'post_id_1',
        is_deleted: false,
      });
      mockDb.post.getById.mockResolvedValue({
        id: 'post_id_1',
        community_id: 'community_id_1',
      });
      mockDb.community.getById.mockResolvedValue({
        id: 'community_id_1',
        type: 'PUBLIC',
      });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.commentVote.getById.mockResolvedValue(null);
    });

    const mockRequest = {
      comment_id: '1',
      vote_type: 'UPVOTE',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .post('/comment/vote')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully upvote a comment', async () => {
        mockDb.commentVote.create.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully voted for Comment');
        expect(mockDb.commentVote.create).toHaveBeenCalledWith(
          '1',
          mockUser.id,
          'UPVOTE',
          'comment_author_id',
        );
      });

      it('should allow basic users to vote in a restricted community', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: 'community_id_1',
          type: 'RESTRICTED',
        });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        mockDb.commentVote.create.mockResolvedValue(true);

        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully voted for Comment');
      });

      it('should successfully update a vote', async () => {
        mockDb.commentVote.getById.mockResolvedValue({ vote_type: 'DOWNVOTE' });
        mockDb.commentVote.update.mockResolvedValue(true);

        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated comment vote');
        expect(mockDb.commentVote.update).toHaveBeenCalledWith(
          '1',
          mockUser.id,
          'UPVOTE',
          'comment_author_id',
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle comment not existing', async () => {
        mockDb.comment.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Comment not found');
      });

      it('should handle deleted comment', async () => {
        mockDb.comment.getById.mockResolvedValue({
          id: '1',
          user_id: 'comment_author_id',
          post_id: 'post_id_1',
          is_deleted: true,
        });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Comment is deleted');
      });

      it('should handle comment without user_id', async () => {
        mockDb.comment.getById.mockResolvedValue({
          id: '1',
          user_id: null,
          post_id: 'post_id_1',
          is_deleted: false,
        });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Comment not found');
      });

      it('should handle post not being found', async () => {
        mockDb.post.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Post not found');
      });

      it('should handle community not being found', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user being banned from community', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
      });

      it('should handle vote already existing', async () => {
        mockDb.commentVote.getById.mockResolvedValue({ vote_type: 'UPVOTE' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'You already voted for this comment');
      });

      it('should not allow non-member to vote in a restricted community', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: 'community_id_1',
          type: 'RESTRICTED',
        });
        mockDb.userCommunity.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to vote');
      });

      it('should not allow non-member to vote in private communities', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: 'community_id_1',
          type: 'PRIVATE',
        });
        mockDb.userCommunity.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to vote');
      });

      it('should handle incorrect vote type', async () => {
        const response = await sendRequest({
          comment_id: '1',
          vote_type: 'INVALID_TYPE',
        });

        // This should fail validation before reaching the controller
        expect(response.status).toBe(400);
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        // This should fail validation before reaching the controller
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });

  describe('DELETE /comment/vote', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .delete('/comment/vote')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.comment.getById.mockResolvedValue({
        id: '1',
        user_id: 'comment_author_id',
        post_id: 'post_id_1',
        is_deleted: false,
      });
      mockDb.post.getById.mockResolvedValue({
        id: 'post_id_1',
        community_id: 'community_id_1',
      });
      mockDb.community.getById.mockResolvedValue({
        id: 'community_id_1',
        type: 'PUBLIC',
      });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.commentVote.getById.mockResolvedValue({ vote_type: 'UPVOTE' });
    });

    const mockRequest = {
      comment_id: '1',
    };

    describe('Success cases', () => {
      it('should successfully delete a vote', async () => {
        mockDb.commentVote.delete.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully deleted comment vote');
        expect(mockDb.commentVote.delete).toHaveBeenCalledWith(
          '1',
          mockUser.id,
          'UPVOTE',
          'comment_author_id',
        );
      });
    });

    describe('Error cases', () => {
      it('should handle vote not existing', async () => {
        mockDb.commentVote.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Vote not found');
      });

      it('should not allow comment vote deletion if user is non-member in restricted community', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: 'community_id_1',
          type: 'RESTRICTED',
        });
        mockDb.userCommunity.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to vote');
      });

      it('should not allow comment vote deletion if user is non-member in private community', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: 'community_id_1',
          type: 'PRIVATE',
        });
        mockDb.userCommunity.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to vote');
      });

      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle comment not existing', async () => {
        mockDb.comment.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Comment not found');
      });

      it('should handle post not being found', async () => {
        mockDb.post.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Post not found');
      });

      it('should handle community not being found', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user being banned from community', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        // This should fail validation before reaching the controller
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

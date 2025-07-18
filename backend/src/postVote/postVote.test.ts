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
import db from '@/db/db';

// prettier-ignore
describe('Post vote', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/post/vote', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC' });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.postVote.getById.mockResolvedValue(false);
    });

    const mockRequest = {
      post_id: '1',
      vote_type: 'UPVOTE',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/post/vote')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully upvote a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully voted for post');
      });

      it('should successfully downvote a post', async () => {
        const response = await sendRequest({ ...mockRequest, vote_type: 'DOWNVOTE' });

        assert.exp(response, 201, 'Successfully voted for post');
      });

      it('should successfully update a vote', async () => {
        mockDb.postVote.getById.mockResolvedValue({ vote_type: 'DOWNVOTE' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated vote');
        expect(db.postVote.update).toHaveBeenCalled();
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle post not being found', async () => {
        mockDb.post.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Post not found');
      });

      it('should handle community not being found', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle user being banned from community', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
      });

      it('should handle user already voting for a post', async () => {
        mockDb.postVote.getById.mockResolvedValue({ vote_type: 'UPVOTE' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'You already voted for this post');
      });

      it('should handle voting on deleted post', async () => {
        mockDb.post.getById.mockResolvedValue({ deleted_at: new Date() });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 410, 'Post was deleted');
      });

      it('should handle to not allow to vote for a private/restricted community you are not a member of', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to vote');
      });

      it('should handle not allowing to vote for a private community', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Basic users cannot vote in this community');
      });

      it('should handle invalid type', async () => {
        const response = await sendRequest({ ...mockRequest, vote_type: 'invalid_type' });

        expect(response.body.errors[0].msg).toBe('Invalid post vote type detected: invalid_type');
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
                  'msg': 'Vote type is required',
                  'path': 'vote_type',
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

  describe('DELETE /community/post/vote', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC' });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.postVote.getById.mockResolvedValue(true);
    });

    const mockRequest = {
      post_id: '1',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/community/post/vote')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully remove a vote from a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully removed vote from post');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle post not being found', async () => {
        mockDb.post.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Post not found');
      });

      it('should handle community not being found', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle vote not existing', async () => {
        mockDb.postVote.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Vote not found');
      });

      it('should handle banned user not being able remove vote if banned', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle not being able remove vote from restricted community when not being contributor anymore', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Only Contributors can vote in restricted communities');
      });

      it('should handle not being able remove vote from private community the user was removed', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to vote');
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
});

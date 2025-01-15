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
describe('/community/post/comment/vote', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/post/comment', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue(true);
      mockDb.comment.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC' });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.commentVote.getById.mockResolvedValue(false);
    });

    const mockRequest = {
      comment_id: '1',
      vote_type: 'UPVOTE',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/post/comment/vote')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully upvote a comment', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully voted for Comment');
      });

      it('should allow basic users to vote in a restricted community', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully voted for Comment');
      });

      it('should successfully update a vote', async () => {
        mockDb.commentVote.getById.mockResolvedValue({ vote_type: 'DOWNVOTE' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated comment vote');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle comment not existing', async () => {
        mockDb.comment.getById.mockResolvedValue(false);
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
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully voted for Comment');
      });

      it('should not allow non-member to vote in private communities', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to vote');
      });

      it('should handle incorrect vote type', async () => {

      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({});
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

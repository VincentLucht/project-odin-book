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
describe('POST /community', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  const mockRequest = {
    content: 'This is a comment',
    post_id: '1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockDb.user.getById.mockResolvedValue(true);
    mockDb.post.getById.mockResolvedValue(true);
    mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC' });
    mockDb.bannedUsers.isBanned.mockResolvedValue(false);
  });

  describe('POST /community/post/comment', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/post/comment')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully create a comment', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully posted Comment');
      });

      it('should successfully reply to a comment', async () => {
        mockDb.comment.getById.mockResolvedValue(true);
        const response = await sendRequest({ ...mockRequest, parent_comment_id: '1' });

        assert.exp(response, 201, 'Successfully replied to Comment');
      });

      it('should successfully create a comment in a restricted community', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'CONTRIBUTOR' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully posted Comment');
      });

      it('should successfully create a comment in a private community', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PRIVATE', allow_basic_user_posts: 'true' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully posted Comment');
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

      it('should not allow to post a comment in private/restricted community, where the user is not a member', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to comment');
      });

      it('should not allow to post a comment in restricted community, if the user is not a contributor', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Only Contributors can post in restricted communities');
      });

      it('should not allow to post a comment in private community, if the user is not a contributor', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE', allow_basic_user_posts: false });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Basic users cannot comment in this community');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          'errors': [
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Content must be at least 1 characters long',
                  'path': 'content',
                  'location': 'body',
              },
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

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
describe('/community', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('GET /community/post', () => {
    beforeEach(() => {
      mockDb.post.getById.mockResolvedValue({ community_id: '1' });
      mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC', allow_basic_user_posts: true, is_post_flair_required: false });
    });

    const sendRequest = (post_id = 1) => {
      return request(app)
        .get(`/post/${post_id}`)
        .set('Authorization', `Bearer ${token}`);
    };

    describe('Success cases', () => {
      it('should fetch post and community', async () => {
        const response = await sendRequest();

        assert.exp(response, 200, 'Successfully fetched post');
      });
    });

    describe('Error cases', () => {
      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest();

        assert.post.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest();

        assert.community.notFound(response);
      });

      it('should handle not allowing user to fetch in private community', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest();

        console.log(response.body);

        assert.exp(response, 403, 'You are not part of this community');
      });

      it('should handle user not allowed to fetch in private community because of ban', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(true);
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest();

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle missing inputs', async () => {
        const response = await request(app)
        .get('/post/')
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
      });
    });
  });

  describe('POST /community/post', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC', allow_basic_user_posts: true, is_post_flair_required: false });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/post')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    const mockRequest = {
      community_id: '1',
      title: 't',
      body: 'b',
      is_spoiler: false,
      is_mature: false,
      type: 'BASIC',
    };

    describe('Success cases', () => {
      it('should successfully create a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully created post');
      });

      it('should successfully create a post in a restricted community', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'CONTRIBUTOR' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully created post');
      });

      it('should successfully create a post in a private community', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'CONTRIBUTOR' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully created post');
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

      it('should not allow user to post in private/restricted communities they are not a part of', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to post');
      });

      it('should handle user not being able to post in restricted community because they are not a contributor', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Only Contributors can post in restricted communities');
      });

      it('should handle user not being able to post in private community because they are not a contributor', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Basic users cannot post in this community');
      });

      it('should handle incorrect post type', async () => {
        const response = await sendRequest({ ...mockRequest, type: 'invalid' });

        expect(response.body).toMatchObject({
          errors: [
            {
              type: 'field',
              value: 'invalid',
              msg: 'Invalid type detected: invalid',
              path: 'type',
              location: 'body',
            },
          ],
        });
      });

      it('it should handle community requiring flairs + sending an incorrect flair', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC', allow_basic_user_posts: true, is_post_flair_required: true });
        mockDb.communityFlair.getById.mockResolvedValue(false);
        const response = await sendRequest({ ...mockRequest, flair_id: 'invalid' });

        expect(response.body.error).toBe('Flair not found');
      });

      it('should not allow banned user to post', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          'errors': [
            {
              'type': 'field',
              'msg': 'Community ID is required',
              'path': 'community_id',
              'location': 'body',
            },
            {
              'type': 'field',
              'msg': 'Title must be at least 1 characters long',
              'path': 'title',
              'location': 'body',
            },
            {
              'type': 'field',
              'msg': 'Body must be at least 1 characters long',
              'path': 'body',
              'location': 'body',
            },
            {
              'type': 'field',
              'msg': 'Invalid value',
              'path': 'is_spoiler',
              'location': 'body',
            },
            {
              'type': 'field',
              'msg': 'Invalid value',
              'path': 'is_mature',
              'location': 'body',
            },
            {
              'type': 'field',
              'msg': 'Invalid type detected: undefined',
              'path': 'type',
              'location': 'body',
            },
          ],
        });
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue('DB error');
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });

  describe('PUT /community/post', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue({ poster_id: 't1' });
      mockDb.community.getById.mockResolvedValue({ is_post_flair_required: false });
    });

    const sendRequest = (body: any) => {
      return request(app)
        .put('/post')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    const mockRequest = {
      post_id: '1',
      body: 'b',
      is_spoiler: false,
      is_mature: false,
    };

    describe('Success cases', () => {
      it('should successfully edit a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully edited post');
      });

      it('should successfully edit a post where flair is required + had a previous flair', async () => {
        mockDb.community.getById.mockResolvedValue({ is_post_flair_required: true });
        mockDb.communityFlair.getById.mockResolvedValue({ is_assignable_to_posts: true });
        const response = await sendRequest({ ...mockRequest, flair_id: '1' });

        assert.exp(response, 200, 'Successfully edited post');
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

      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.post.notFound(response);
      });

      it('should handle user not being the poster', async () => {
        mockDb.post.getById.mockResolvedValue({ poster_id: 'otherUser' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are not allowed to edit this post');
      });

      it('should handle missing flair when required', async () => {
        mockDb.community.getById.mockResolvedValue({ is_post_flair_required: true });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'Flair is required for this community');
      });

      it('it should handle sending an incorrect flair', async () => {
        const response = await sendRequest({ ...mockRequest, flair_id: 'invalid' });

        expect(response.body.error).toBe('Flair not found');
      });

      it('should not allow banned user to edit', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
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
                    'value': '',
                    'msg': 'Title must be at least 1 characters long',
                    'path': 'title',
                    'location': 'body',
                },
                {
                    'type': 'field',
                    'value': '',
                    'msg': 'Body must be at least 1 characters long',
                    'path': 'body',
                    'location': 'body',
                },
                {
                    'type': 'field',
                    'msg': 'Invalid value',
                    'path': 'is_spoiler',
                    'location': 'body',
                },
                {
                    'type': 'field',
                    'msg': 'Invalid value',
                    'path': 'is_mature',
                    'location': 'body',
                },
            ],
        });
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue('DB error');
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });

  describe('DELETE /community/post', () => {
    beforeEach(() => {
    });

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/post')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    const mockRequest = {
      post_id: '1',

    };

    describe('Success cases', () => {
      it('should successfully delete a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully edited post');
      });
    });

    describe('Error cases', () => {
      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.post.notFound(response);
      });

      it('should handle user not being the poster', async () => {
        mockDb.post.getById.mockResolvedValue({ poster_id: 'otherUser' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are not allowed to edit this post');
      });

      it('should not allow banned user to delete', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
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
        mockDb.user.getById.mockRejectedValue('DB error');
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

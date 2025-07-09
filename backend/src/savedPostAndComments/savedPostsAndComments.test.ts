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
describe('Saved', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockDb.user.getById.mockResolvedValue(true);
    mockDb.post.getById.mockResolvedValue({ id: '1', community_id: '1' });
    mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC' });
    mockDb.comment.getById.mockResolvedValue({ id: '1', post_id: '1' });
    mockDb.userCommunity.isMember.mockResolvedValue(true);
    mockDb.bannedUsers.isBanned.mockResolvedValue(false);
  });

describe('GET /saved/posts', () => {
  const sendRequest = (queryParams: any = {}) => {
    let url = '/saved/posts';
    if (queryParams.cId) {
      url += `?cId=${queryParams.cId}`;
    }
    return request(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`);
  };

  describe('Success cases', () => {
    it('should successfully fetch saved posts without cursor', async () => {
      const mockPosts = [
        { id: '1', title: 'Test Post 1' },
        { id: '2', title: 'Test Post 2' },
      ];
      const mockPagination = { hasMore: false, nextCursor: null };

      mockDb.savedPost.fetch.mockResolvedValue({
        posts: mockPosts,
        pagination: mockPagination,
      });

      const response = await sendRequest();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully fetched saved posts');
      expect(response.body.posts).toEqual(mockPosts);
      expect(response.body.pagination).toEqual(mockPagination);
      expect(mockDb.savedPost.fetch).toHaveBeenCalledWith(mockUser.id, undefined);
    });

    it('should successfully fetch saved posts with cursor', async () => {
      const mockPosts = [
        { id: '3', title: 'Test Post 3' },
        { id: '4', title: 'Test Post 4' },
      ];
      const mockPagination = { hasMore: true, nextCursor: 'cursor123' };

      mockDb.savedPost.fetch.mockResolvedValue({
        posts: mockPosts,
        pagination: mockPagination,
      });

      const response = await sendRequest({ cId: 'cursor123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully fetched saved posts');
      expect(response.body.posts).toEqual(mockPosts);
      expect(response.body.pagination).toEqual(mockPagination);
      expect(mockDb.savedPost.fetch).toHaveBeenCalledWith(mockUser.id, 'cursor123');
    });

    it('should handle empty results', async () => {
      const mockPagination = { hasMore: false, nextCursor: null };

      mockDb.savedPost.fetch.mockResolvedValue({
        posts: [],
        pagination: mockPagination,
      });

      const response = await sendRequest();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully fetched saved posts');
      expect(response.body.posts).toEqual([]);
      expect(response.body.pagination).toEqual(mockPagination);
    });
  });

  describe('Error cases', () => {
    it('should handle user not existing', async () => {
      mockDb.user.getById.mockResolvedValue(false);
      const response = await sendRequest();

      assert.user.notFound(response);
    });

    it('should handle db error', async () => {
      mockDb.user.getById.mockRejectedValue(new Error('DB error'));
      const response = await sendRequest();

      assert.dbError(response);
    });

    it('should handle fetch error', async () => {
      mockDb.savedPost.fetch.mockRejectedValue(new Error('Fetch error'));
      const response = await sendRequest();

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed fetch saved posts');
    });
  });
});

describe('GET /saved/comments', () => {
  const sendRequest = (queryParams: any = {}) => {
    let url = '/saved/comments';
    if (queryParams.cId) {
      url += `?cId=${queryParams.cId}`;
    }
    return request(app)
      .get(url)
      .set('Authorization', `Bearer ${token}`);
  };

  describe('Success cases', () => {
    it('should successfully fetch saved comments without cursor', async () => {
      const mockComments = [
        { id: '1', content: 'Test Comment 1' },
        { id: '2', content: 'Test Comment 2' },
      ];
      const mockPagination = { hasMore: false, nextCursor: null };

      mockDb.savedComment.fetch.mockResolvedValue({
        comments: mockComments,
        pagination: mockPagination,
      });

      const response = await sendRequest();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully fetched saved comments');
      expect(response.body.comments).toEqual(mockComments);
      expect(response.body.pagination).toEqual(mockPagination);
      expect(mockDb.savedComment.fetch).toHaveBeenCalledWith(mockUser.id, undefined);
    });

    it('should successfully fetch saved comments with cursor', async () => {
      const mockComments = [
        { id: '3', content: 'Test Comment 3' },
        { id: '4', content: 'Test Comment 4' },
      ];
      const mockPagination = { hasMore: true, nextCursor: 'cursor456' };

      mockDb.savedComment.fetch.mockResolvedValue({
        comments: mockComments,
        pagination: mockPagination,
      });

      const response = await sendRequest({ cId: 'cursor456' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully fetched saved comments');
      expect(response.body.comments).toEqual(mockComments);
      expect(response.body.pagination).toEqual(mockPagination);
      expect(mockDb.savedComment.fetch).toHaveBeenCalledWith(mockUser.id, 'cursor456');
    });

    it('should handle empty results', async () => {
      const mockPagination = { hasMore: false, nextCursor: null };

      mockDb.savedComment.fetch.mockResolvedValue({
        comments: [],
        pagination: mockPagination,
      });

      const response = await sendRequest();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully fetched saved comments');
      expect(response.body.comments).toEqual([]);
      expect(response.body.pagination).toEqual(mockPagination);
    });
  });

  describe('Error cases', () => {
    it('should handle user not existing', async () => {
      mockDb.user.getById.mockResolvedValue(false);
      const response = await sendRequest();

      assert.user.notFound(response);
    });

    it('should handle db error', async () => {
      mockDb.user.getById.mockRejectedValue(new Error('DB error'));
      const response = await sendRequest();

      assert.dbError(response);
    });

    it('should handle fetch error', async () => {
      mockDb.savedComment.fetch.mockRejectedValue(new Error('Fetch error'));
      const response = await sendRequest();

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch saved comments');
    });
    });
  });

  describe('POST /post/save', () => {
    const mockRequest = {
      post_id: '1',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .post('/post/save')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully save a post', async () => {
        mockDb.savedPost.isSaved.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully saved post');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);
        expect(response.status).toBe(404);

        expect(response.body.message).toBe('Post not found');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle private community access denied', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: '1',
          type: 'PRIVATE',
        });
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not a member of this community',
        );
      });

      it('should handle banned user', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
          'You are banned from this community',
        );
      });

      it('should handle already saved post', async () => {
        mockDb.savedPost.isSaved.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('You already saved this post');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          errors: [
            {
              type: 'field',
              value: '',
              msg: 'Post ID is required',
              path: 'post_id',
              location: 'body',
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

  describe('DELETE /post/save', () => {
    const mockRequest = {
      post_id: '1',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/post/save')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully unsave a post', async () => {
        mockDb.savedPost.isSaved.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully unsaved post');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Post not found');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle post not saved', async () => {
        mockDb.savedPost.isSaved.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('You did not save this post');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          errors: [
            {
              type: 'field',
              value: '',
              msg: 'Post ID is required',
              path: 'post_id',
              location: 'body',
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

  describe('POST /comment/save', () => {
    const mockRequest = {
      comment_id: '1',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .post('/comment/save')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully save a comment', async () => {
        mockDb.savedComment.isSaved.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully saved comment');
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

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Comment not found');
      });

      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Post not found');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle private community access denied', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: '1',
          type: 'PRIVATE',
        });
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not a member of this community',
        );
      });

      it('should handle already saved comment', async () => {
        mockDb.savedComment.isSaved.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('You already saved this comment');
      });

      it('should handle banned user', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are banned from this community',
        );
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          errors: [
            {
              type: 'field',
              value: '',
              msg: 'Comment ID is required',
              path: 'comment_id',
              location: 'body',
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

  describe('DELETE /comment/save', () => {
    const mockRequest = {
      comment_id: '1',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/comment/save')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully unsave a comment', async () => {
        mockDb.savedComment.isSaved.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully unsaved comment');
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
        expect(response.status).toBe(404);

        expect(response.body.message).toBe('Comment not found');
      });

      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);
        expect(response.status).toBe(404);

        expect(response.body.message).toBe('Post not found');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle private community access denied', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: '1',
          type: 'PRIVATE',
        });
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(
          'You are not a member of this community ',
        );
      });

      it('should handle comment not saved', async () => {
        mockDb.savedComment.isSaved.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('You did not save this comment');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          errors: [
            {
              type: 'field',
              value: '',
              msg: 'Comment ID is required',
              path: 'comment_id',
              location: 'body',
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

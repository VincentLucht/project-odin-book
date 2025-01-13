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
describe('/community/post/comment', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/post/comment', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC' });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
    });

    const mockRequest = {
      content: 'This is a comment',
      post_id: '1',
    };

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
        mockDb.comment.getById.mockResolvedValue({ post_id: '1' });
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

        assert.exp(response, 403, 'Only Contributors can comment in restricted communities');
      });

      it('should not allow to post a comment in private community, if the user is not a contributor', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE', allow_basic_user_posts: false });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Basic users cannot comment in this community');
      });

      it('should handle not finding parent comment', async () => {
        mockDb.comment.getById.mockResolvedValue(null);
        const response = await sendRequest({ ... mockRequest, parent_comment_id: '1' });

        assert.exp(response, 404, 'Parent comment not found');
      });

      it('should handle parent comment being deleted', async () => {
        mockDb.comment.getById.mockResolvedValue({ is_deleted: true });
        const response = await sendRequest({ ... mockRequest, parent_comment_id: '1' });

        assert.exp(response, 400, 'Cannot reply to a deleted comment');
      });

      it('should not allow to reply to a post inside of another community', async () => {
        mockDb.comment.getById.mockResolvedValue({ post_id: 'otherPost' });
        const response = await sendRequest({ ...mockRequest, parent_comment_id: '1' });

        assert.exp(response, 400, 'Cannot reply to a comment from a different post');
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

  describe('DELETE /community/post/comment', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .delete('/community/post/comment')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    const mockRequest = { comment_id: '1' };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.comment.getById.mockResolvedValue({ is_deleted: false, user_id: 't1' });
      mockDb.post.getById.mockResolvedValue({ community_id: '1' });
      mockDb.community.getById.mockResolvedValue({ type: 'PUBLIC' });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
    });

    describe('Success Cases', () => {
      it('should successfully fully delete a comment that has no replies', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully deleted Comment');
        expect(db.comment.delete).toHaveBeenCalled();
      });

      it('should successfully soft delete a comment that has a reply', async () => {
        mockDb.comment.getById.mockResolvedValue({ is_deleted: false, user_id: 't1', replies: [{ id: 'fake' }] });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully deleted Comment');
        expect(db.comment.softDelete).toHaveBeenCalled();
      });
    });

    describe('Error Cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'User not found');
      });

      it('should handle comment not existing', async () => {
        mockDb.comment.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Comment not found');
      });

      it('should handle comment already being deleted', async () => {
        mockDb.comment.getById.mockResolvedValue({ is_deleted: true });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 410, 'Comment is already deleted');
      });

      it("should handle user trying to delete other users' comments", async () => {
        mockDb.comment.getById.mockResolvedValue({ user_id: 'someOtherUser' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You cannot delete other Comments');
      });

      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Post not found');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle non-member trying to delete comment of private community', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
        mockDb.userCommunity.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this private community to modify your comments');
      });

      it('should handle user being banned', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle missing input', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          'errors': [
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Comment ID is required',
                  'path': 'comment_id',
                  'location': 'body',
              },
          ],
      });
      });

      it('should handle DB error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

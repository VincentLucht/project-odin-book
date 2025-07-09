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
describe('Comment', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('GET /comment?pId=post_id&sbt=sort_by_type', () => {
    beforeEach(() => {
      mockDb.post.getById.mockResolvedValue({ id: '1', community_id: '1' });
      mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PUBLIC' });
      mockDb.comment.getCommentThreads.mockResolvedValue({ comments: [], pagination: {} });
    });

    const sendRequest = () => {
      return request(app)
        .get('/comment?pId=1&sbt=new')
        .set('Authorization', `Bearer ${token}`);
    };

    describe('Success cases', () => {
      it('should successfully fetch comments from a post', async () => {
        const response = await sendRequest();

        assert.exp(response, 200, 'Successfully fetched comments');
        expect(response.body.comments).toBeDefined();
        expect(response.body.pagination).toBeDefined();
      });

      it('should successfully fetch comments from a post inside of a private community', async () => {
        mockDb.post.getById.mockResolvedValue({ id: '1', community_id: '1' });
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(true);
        mockDb.bannedUsers.isBanned.mockResolvedValue(false);
        const response = await sendRequest();

        assert.exp(response, 200, 'Successfully fetched comments');
      });
    });

    describe('Error cases', () => {
      it('should handle post not being found', async () => {
        mockDb.post.getById.mockResolvedValue(null);
        const response = await sendRequest();

        assert.exp(response, 404, 'Post not found');
      });

      it('should not allow to fetch comments in private community where the user is not a member', async () => {
        mockDb.post.getById.mockResolvedValue({ id: '1', community_id: '1' });
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await request(app)
          .get('/comment?pId=1&sbt=new')
          .set('Authorization', `Bearer ${generateToken('otherUserId', 'otherUsername')}`);

        assert.exp(response, 403, 'You are not part of this community');
        expect(db.comment.getCommentThreads).not.toHaveBeenCalled();
      });

      it('should handle user being banned from community', async () => {
        mockDb.post.getById.mockResolvedValue({ id: '1', community_id: '1' });
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(true);
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest();

        assert.isBanned(response);
      });

      it('should handle db error', async () => {
        mockDb.post.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest();

        assert.dbError(response);
      });
    });
  });

  describe('POST /comment', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue({
        id: '1',
        community_id: '1',
        poster_id: 'poster123',
        title: 'Test Post',
        lock_comments: false,
      });
      mockDb.community.getById.mockResolvedValue({ id: '1', name: 'testcommunity', type: 'PUBLIC' });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.comment.create.mockResolvedValue({ id: 'comment123' });
      mockDb.notification.send.mockResolvedValue(true);
    });

    const mockRequest = {
      content: 'This is a comment',
      post_id: '1',
    };

    const sendRequest = (body: any) => {
      return request(app)
        .post('/comment')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully create a comment', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully posted Comment');
        expect(mockDb.comment.create).toHaveBeenCalledWith('This is a comment', '1', 't1', undefined);
        expect(mockDb.notification.send).toHaveBeenCalled();
      });

      it('should successfully reply to a comment', async () => {
        mockDb.comment.getById.mockResolvedValue({
          id: '1',
          post_id: '1',
          user_id: 'user123',
          is_deleted: false,
        });
        const response = await sendRequest({ ...mockRequest, parent_comment_id: '1' });

        assert.exp(response, 201, 'Successfully replied to Comment');
        expect(mockDb.comment.create).toHaveBeenCalledWith('This is a comment', '1', 't1', '1');
      });

      it('should successfully create a comment in a restricted community', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', name: 'testcommunity', type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'CONTRIBUTOR' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully posted Comment');
      });

      it('should successfully create a comment in a private community', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: '1',
          name: 'testcommunity',
          type: 'PRIVATE',
          allow_basic_user_posts: true,
        });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'CONTRIBUTOR' });

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

      it('should handle post comment being locked', async () => {
        mockDb.post.getById.mockResolvedValue({
          id: '1',
          community_id: '1',
          poster_id: 'poster123',
          title: 'Test Post',
          lock_comments: true,
        });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Comments are locked');
      });

      it('should handle user being banned from community', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.isBanned(response);
      });

      it('should not allow to post a comment in private/restricted community, where the user is not a member', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', name: 'testcommunity', type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You must be a member of this community to comment');
      });

      it('should not allow to post a comment in restricted community, if the user is not a contributor', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', name: 'testcommunity', type: 'RESTRICTED' });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Only Contributors can comment in restricted communities');
      });

      it('should not allow to post a comment in private community, if the user is not a contributor', async () => {
        mockDb.community.getById.mockResolvedValue({
          id: '1',
          name: 'testcommunity',
          type: 'PRIVATE',
          allow_basic_user_posts: false,
        });
        mockDb.userCommunity.getById.mockResolvedValue({ role: 'BASIC' });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Basic users cannot comment in this community');
      });

      it('should handle not finding parent comment', async () => {
        mockDb.comment.getById.mockResolvedValue(null);
        const response = await sendRequest({ ...mockRequest, parent_comment_id: '1' });

        assert.exp(response, 404, 'Parent comment not found');
      });

      it('should handle parent comment being deleted', async () => {
        mockDb.comment.getById.mockResolvedValue({
          id: '1',
          post_id: '1',
          user_id: 'user123',
          is_deleted: true,
        });
        const response = await sendRequest({ ...mockRequest, parent_comment_id: '1' });

        assert.exp(response, 400, 'Cannot reply to a deleted comment');
      });

      it('should not allow to reply to a comment from a different post', async () => {
        mockDb.comment.getById.mockResolvedValue({
          id: '1',
          post_id: 'otherPost',
          user_id: 'user123',
          is_deleted: false,
        });
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

  describe('DELETE /comment', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .delete('/comment')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    const mockRequest = { comment_id: '1' };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.comment.getById.mockResolvedValue({
        id: '1',
        is_deleted: false,
        user_id: 't1',
        post_id: '1',
      });
      mockDb.post.getById.mockResolvedValue({
        id: '1',
        community_id: '1',
      });
      mockDb.community.getById.mockResolvedValue({
        id: '1',
        type: 'PUBLIC',
      });
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.comment.softDelete.mockResolvedValue(true);
    });

    describe('Success Cases', () => {
      it('should successfully delete a comment (soft delete)', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully deleted Comment');
        expect(mockDb.comment.softDelete).toHaveBeenCalledWith('1', 't1');
      });

      it('should successfully delete a comment in private community when user is member', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(true);

        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully deleted Comment');
        expect(mockDb.comment.softDelete).toHaveBeenCalledWith('1', 't1');
      });
    });

    describe('Error Cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'User not found');
      });

      it('should handle comment not existing', async () => {
        mockDb.comment.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Comment not found');
      });

      it('should handle comment already being deleted', async () => {
        mockDb.comment.getById.mockResolvedValue({
          id: '1',
          is_deleted: true,
          user_id: 't1',
          post_id: '1',
        });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 410, 'Comment is already deleted');
      });

      it("should handle user trying to delete other users' comments", async () => {
        mockDb.comment.getById.mockResolvedValue({
          id: '1',
          is_deleted: false,
          user_id: 'someOtherUser',
          post_id: '1',
        });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You cannot delete other Comments');
      });

      it('should handle post not existing', async () => {
        mockDb.post.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Post not found');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle non-member trying to delete comment of private community', async () => {
        mockDb.community.getById.mockResolvedValue({ id: '1', type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(false);
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

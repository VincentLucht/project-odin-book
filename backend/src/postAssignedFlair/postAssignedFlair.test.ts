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
describe('/community/post/flair', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/post/flair', () => {
    const mockRequest = {
      post_id: '1',
      community_flair_id: '1',
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue({ community_id: '1', poster_id: 't1' });
      mockDb.community.doesExistById.mockResolvedValue(true);
      mockDb.userCommunity.isMember.mockResolvedValue(true);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.communityFlair.getById.mockResolvedValue({ is_assignable_to_posts: true });
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/post/flair')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully assign a flair to a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully assigned flair');
      });

      it('should successfully update a flair', async () => {
        mockDb.postAssignedFlair.getPostFlairInCommunity.mockResolvedValue({ community_flair_id: '2', post_id: '1' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated flair');
        expect(db.postAssignedFlair.update).toHaveBeenCalled();
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

        assert.post.notFound(response);
      });

      it('should handle user not being post author', async () => {
        mockDb.post.getById.mockResolvedValue({ community_id: '1', poster_id: 'otherUser' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are not the post author');
      });

      it('should handle community not existing', async () => {
        mockDb.community.doesExistById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user not being member', async () => {
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Non-members cannot assign post flairs');
      });

      it('should handle user being banned', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle community flair not existing', async () => {
        mockDb.communityFlair.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community flair not found');
      });

      it('should handle flair not being assignable to users', async () => {
        mockDb.communityFlair.getById.mockResolvedValue({ is_assignable_to_users: false });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'Flair is only assignable to users');
      });

      it('should handle flair not belonging to post', async () => {
        mockDb.postAssignedFlair.getPostFlairInCommunity.mockResolvedValue({ community_flair_id: '1', post_id: 'someOtherPost' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'This flair does not belong to this post');
      });

      it('should handle post already having a flair', async () => {
        mockDb.postAssignedFlair.getPostFlairInCommunity.mockResolvedValue({ community_flair_id: '1', post_id: '1' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'You already use this flair');
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
                  'msg': 'Community flair ID is required',
                  'path': 'community_flair_id',
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

  describe('POST /community/post/flair', () => {
    const mockRequest = {
      post_id: '1',
      post_assigned_flair_id: '1',
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue({ community_id: '1', poster_id: 't1' });
      mockDb.community.doesExistById.mockResolvedValue(true);
      mockDb.userCommunity.isMember.mockResolvedValue(true);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.postAssignedFlair.getById.mockResolvedValue({ post_id: '1' });
    });

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/community/post/flair')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully delete post flair', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully removed post flair');
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

        assert.post.notFound(response);
      });

      it('should handle user not being post author', async () => {
        mockDb.post.getById.mockResolvedValue({ community_id: '1', poster_id: 'otherUser' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are not the post author');
      });

      it('should handle community not existing', async () => {
        mockDb.community.doesExistById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user not being member', async () => {
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Non-members cannot assign post flairs');
      });

      it('should handle user being banned', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle flair not belonging to post', async () => {
        mockDb.postAssignedFlair.getById.mockResolvedValue({ community_flair_id: '1', post_id: 'someOtherPost' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'This flair does not belong to this post');
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
                  'msg': 'Post assigned flair ID is required',
                  'path': 'post_assigned_flair_id',
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

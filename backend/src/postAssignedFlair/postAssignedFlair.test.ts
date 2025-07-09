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
describe('Post assigned flair', () => {
  const token = generateToken(mockUser.id, mockUser.username);
  const modToken = generateToken('2', 't2');

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
      mockDb.community.getById.mockResolvedValue(true);
      mockDb.communityModerator.isMod.mockResolvedValue(false);
      mockDb.userCommunity.isMember.mockResolvedValue(true);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.communityFlair.getById.mockResolvedValue({ is_assignable_to_posts: true });
    });

    const sendRequest = (body: any, useModToken = false) => {
      return request(app)
        .post('/community/post/flair')
        .set('Authorization', `Bearer ${useModToken ? modToken : token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully assign a flair to a post', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully assigned post flair');
      });

      it('should successfully update a flair', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue({ community_flair_id: '2', post_id: '1' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated post flair');
        expect(db.postAssignedFlair.update).toHaveBeenCalled();
      });

      it('should successfully assign a flair to a post as a MODERATOR', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(true);

        const response = await sendRequest(mockRequest, true);

        assert.exp(response, 201, 'Successfully assigned post flair');
      });

      it('should successfully update a flair as a MODERATOR', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue({ community_flair_id: '2', post_id: '1' });
        mockDb.communityModerator.isMod.mockResolvedValue(true);

        const response = await sendRequest(mockRequest, true);

        assert.exp(response, 200, 'Successfully updated post flair');
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

        assert.exp(response, 403, 'You are not allowed to edit this post flair');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user not being member in a private community', async () => {
        mockDb.community.getById.mockResolvedValue({ type: 'PRIVATE' });
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

      it('should handle flair not being assignable to posts', async () => {
        mockDb.communityFlair.getById.mockResolvedValue({ is_assignable_to_posts: false });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'Flair is only assignable to users');
      });

      it('should handle flair not belonging to post', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue({ community_flair_id: '1', post_id: 'someOtherPost' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'This flair does not belong to this post');
      });

      it('should handle post already having a flair', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue({ community_flair_id: '1', post_id: '1' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'You already use this post flair');
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

  describe('DELETE /community/post/flair', () => {
    const mockRequest = {
      post_id: '1',
      community_flair_id: '1',
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getById.mockResolvedValue({ community_id: '1', poster_id: 't1' });
      mockDb.community.getById.mockResolvedValue(true);
      mockDb.communityModerator.isMod.mockResolvedValue(false);
      mockDb.userCommunity.isMember.mockResolvedValue(true);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.communityFlair.getById.mockResolvedValue({ is_assignable_to_posts: true });
    });

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/community/post/flair')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully delete post flair', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue({ post_id: '1' });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully removed post flair');
      });

      it('should successfully delete post flair AS a moderator', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue({ post_id: '1' });
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

        assert.exp(response, 403, 'You are not allowed to edit this post flair');
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user not being member', async () => {
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Non-members cannot assign post flairs');
      });

      it('should handle post flair being required in community', async () => {
        mockDb.community.getById.mockResolvedValue({ is_post_flair_required: true });
        const response = await sendRequest(mockRequest);

        assert.exp(response, 400, 'Post Flairs are required for this community');
      });

      it('should handle post flair not existing', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Flair not found');
      });

      it('should handle user being banned', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are banned from this community');
      });

      it('should handle flair not belonging to post', async () => {
        mockDb.postAssignedFlair.hasPostFlair.mockResolvedValue({ community_flair_id: '1', post_id: 'someOtherPost' });
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
});

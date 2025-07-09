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
describe('Community Flair', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('GET /community/flair/all (getAllCommunityFlairs)', () => {
    const mockCommunity = {
      id: '1',
      name: 'testcommunity',
      type: 'PUBLIC',
    };

    const mockCommunityFlairs = [
      {
        id: '1',
        name: 'Post Flair',
        color: '#9B3620',
        textColor: '#FFFFFF',
        is_assignable_to_posts: true,
        is_assignable_to_users: false,
      },
    ];

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue(mockCommunity);
      mockDb.communityFlair.getAllCommunityFlairs.mockResolvedValue(mockCommunityFlairs);
    });

    const sendRequest = (query: any = {}) => {
      return request(app)
        .get('/community/flair/all')
        .set('Authorization', `Bearer ${token}`)
        .query(query);
    };

    describe('Success cases', () => {
      it('should successfully fetch all community flairs', async () => {
        const response = await sendRequest({ community_id: '1' });

        assert.exp(response, 200, 'Successfully fetched all flairs');
        expect(response.body.allFlairs).toEqual(mockCommunityFlairs);
        expect(mockDb.communityFlair.getAllCommunityFlairs).toHaveBeenCalledWith('1');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest({ community_id: '1' });
        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest({ community_id: '1' });
        assert.exp(response, 404, 'Community not found');
      });

      it('should handle private community when user is not member', async () => {
        mockDb.community.getById.mockResolvedValue({ ...mockCommunity, type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(false);
        const response = await sendRequest({ community_id: '1' });
        assert.exp(response, 403, 'You are not a member of this private community');
      });
    });
  });

  describe('GET /community/flair (fetchFlairs)', () => {
    const mockCommunity = {
      id: '1',
      name: 'testcommunity',
      type: 'PUBLIC',
    };

    const mockFlairsResponse = {
      flairs: [
        {
          id: '1',
          name: 'Test Flair',
          color: '#9B3620',
          textColor: '#FFFFFF',
          is_assignable_to_posts: true,
          is_assignable_to_users: false,
        },
      ],
      pagination: {
        hasNext: false,
        nextCursor: null,
      },
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getByName.mockResolvedValue(mockCommunity);
      mockDb.communityFlair.fetch.mockResolvedValue(mockFlairsResponse);
      mockDb.communityFlair.getCommunityFlairCount.mockResolvedValue(5);
    });

    const sendRequest = (query: any = {}) => {
      return request(app)
        .get('/community/flair')
        .set('Authorization', `Bearer ${token}`)
        .query(query);
    };

    describe('Success cases', () => {
      it('should successfully fetch flairs with pagination', async () => {
        const response = await sendRequest({
          cn: 'testcommunity',
          cId: 'cursor123',
          t: 'post',
        });

        assert.exp(response, 200, 'Successfully fetched flairs');
        expect(response.body.flairs).toEqual(mockFlairsResponse.flairs);
        expect(response.body.pagination).toEqual(mockFlairsResponse.pagination);
        expect(mockDb.communityFlair.fetch).toHaveBeenCalledWith('1', 'cursor123', 'post');
      });

      it('should include community flair count on initial fetch', async () => {
        const response = await sendRequest({
          cn: 'testcommunity',
          cId: 'cursor123',
          t: 'post',
          initF: 'true',
        });

        assert.exp(response, 200, 'Successfully fetched flairs');
        expect(response.body.communityFlairCount).toBe(5);
        expect(mockDb.communityFlair.getCommunityFlairCount).toHaveBeenCalledWith('1');
      });

      it('should handle user type flairs', async () => {
        const response = await sendRequest({
          cn: 'testcommunity',
          cId: 'cursor123',
          t: 'user',
        });

        assert.exp(response, 200, 'Successfully fetched flairs');
        expect(mockDb.communityFlair.fetch).toHaveBeenCalledWith('1', 'cursor123', 'user');
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest({
          cn: 'testcommunity',
          cId: 'cursor123',
          t: 'post',
        });

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.getByName.mockResolvedValue(null);
        const response = await sendRequest({
          cn: 'testcommunity',
          cId: 'cursor123',
          t: 'post',
        });

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle private community when user is not member', async () => {
        mockDb.community.getByName.mockResolvedValue({ ...mockCommunity, type: 'PRIVATE' });
        mockDb.userCommunity.isMember.mockResolvedValue(false);

        const response = await sendRequest({
          cn: 'testcommunity',
          cId: 'cursor123',
          t: 'post',
        });

        assert.exp(response, 403, 'You are not member of this private community');
      });
    });
  });

  describe('POST /community/flair', () => {
    const mockRequest = {
      community_id: '1',
      name: 'Test Flair',
      textColor: '#FFFFFF',
      color: '#9B3620',
      is_assignable_to_posts: true,
      is_assignable_to_users: false,
      emoji: '🎉',
    };

    const mockCreatedFlair = {
      id: '1',
      ...mockRequest,
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.doesExistById.mockResolvedValue(true);
      mockDb.communityFlair.doesExistByName.mockResolvedValue(false);
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.communityFlair.getCommunityFlairCount.mockResolvedValue(50);
      mockDb.communityFlair.create.mockResolvedValue(mockCreatedFlair);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/flair')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully create a flair', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully created flair');
        expect(response.body.flair).toEqual(mockCreatedFlair);
        expect(mockDb.communityFlair.create).toHaveBeenCalledWith(
          mockRequest.community_id,
          mockRequest.name,
          mockRequest.textColor,
          mockRequest.color,
          mockRequest.is_assignable_to_posts,
          mockRequest.is_assignable_to_users,
          mockRequest.emoji,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.doesExistById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle flair already existing', async () => {
        mockDb.communityFlair.doesExistByName.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'Flair already exists');
      });

      it('should handle user not being a moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle flair limit reached', async () => {
        mockDb.communityFlair.getCommunityFlairCount.mockResolvedValue(700);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 422, 'Community flair limit of 700 reached');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          'errors': [
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Name must be at least 1 characters long',
                  'path': 'name',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Community ID is required',
                  'path': 'community_id',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'textColor is required',
                  'path': 'textColor',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Color must be a valid hex code starting with "#"',
                  'path': 'textColor',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'color is required',
                  'path': 'color',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Color must be a valid hex code starting with "#"',
                  'path': 'color',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'msg': 'Invalid value',
                  'path': 'is_assignable_to_posts',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'msg': 'Invalid value',
                  'path': 'is_assignable_to_users',
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

  describe('PUT /community/flair', () => {
    const mockRequest = {
      community_flair_id: '1',
      community_id: '1',
      name: 'Updated Flair',
      textColor: '#000000',
      color: '#FF0000',
      is_assignable_to_posts: false,
      is_assignable_to_users: true,
      emoji: '🔥',
    };

    const mockUpdatedFlair = {
      id: '1',
      ...mockRequest,
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.doesExistById.mockResolvedValue(true);
      mockDb.communityFlair.getById.mockResolvedValue({ id: '1', name: 'Test Flair' });
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.communityFlair.update.mockResolvedValue(mockUpdatedFlair);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .put('/community/flair')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully update a flair', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated flair');
        expect(response.body.flair).toEqual(mockUpdatedFlair);
        expect(mockDb.communityFlair.update).toHaveBeenCalledWith(
          mockRequest.community_flair_id,
          mockRequest.community_id,
          mockRequest.name,
          mockRequest.textColor,
          mockRequest.color,
          mockRequest.is_assignable_to_posts,
          mockRequest.is_assignable_to_users,
          mockRequest.emoji,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.doesExistById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle flair not found', async () => {
        mockDb.communityFlair.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'Flair not found');
      });

      it('should handle user not being a moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });

  describe('DELETE /community/flair', () => {
    const mockRequest = {
      community_id: '1',
      community_flair_id: '1',
    };

    const mockCommunity = {
      id: '1',
      name: 'testcommunity',
      is_post_flair_required: false,
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getById.mockResolvedValue(mockCommunity);
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.communityFlair.delete.mockResolvedValue(undefined);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/community/flair')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully delete a flair', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully deleted flair');
        expect(mockDb.communityFlair.delete).toHaveBeenCalledWith(mockRequest.community_flair_id);
      });

      it('should successfully delete a flair when post flair is required but multiple flairs exist', async () => {
        mockDb.community.getById.mockResolvedValue({ ...mockCommunity, is_post_flair_required: true });
        mockDb.communityFlair.getPostFlairCount.mockResolvedValue(3);

        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully deleted flair');
        expect(mockDb.communityFlair.delete).toHaveBeenCalledWith(mockRequest.community_flair_id);
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle deleting last post flair when post flair is required', async () => {
        mockDb.community.getById.mockResolvedValue({ ...mockCommunity, is_post_flair_required: true });
        mockDb.communityFlair.getPostFlairCount.mockResolvedValue(1);

        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'Cannot delete the last post flair when post flair is required');
      });

      it('should handle user not being a moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

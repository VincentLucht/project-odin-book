import * as dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import express from 'express';
import router from '@/routes/router';

import { mockUser, mockCommunity } from '@/util/test/testUtil';
import { generateToken } from '@/util/test/testUtil';
import assert from '@/util/test/assert';
import valErr from '@/util/test/validationErrors';

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
describe('Community', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community', () => {
    const mockRequest = {
      ...mockCommunity,
      user_id: mockUser.id,
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.doesExistByName.mockResolvedValue(false);
      mockDb.community.create.mockResolvedValue(undefined);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it(
        'should create a community with an owner, name, description, not private, not mature, public type, and 2 valid topics',
        async () => {
          const response = await sendRequest(mockRequest);

          assert.exp(response, 201, 'Successfully created community');
          expect(mockDb.community.create).toHaveBeenCalledWith(
            mockRequest.name,
            mockRequest.description,
            mockRequest.is_mature,
            mockRequest.allow_basic_user_posts,
            mockRequest.is_post_flair_required,
            mockUser.id,
            mockRequest.type,
            mockRequest.topics,
            // pfp's
            undefined,
            undefined,
            undefined,
          );
        });
    });

    describe('Error cases', () => {
      it('should handle a name already being used', async () => {
        mockDb.community.doesExistByName.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'Community Name already in use');
      });

      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle incorrect topics', async () => {
        const response = await sendRequest({ ...mockRequest, topics: ['nothing'] });

        expect(response.body).toMatchObject(valErr.invalidTopic('nothing'));
      });

      it('should handle incorrect types', async () => {
        const response = await sendRequest({ ...mockRequest, type: 'invalidType' });

        expect(response.body).toMatchObject(valErr.invalidType());
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
    'errors': [
        {
            'type': 'field',
            'msg': 'Name is required',
            'path': 'name',
            'location': 'body',
        },
        {
            'type': 'field',
            'value': '',
            'msg': 'Description is required',
            'path': 'description',
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
            'msg': 'Invalid value',
            'path': 'is_post_flair_required',
            'location': 'body',
        },
        {
            'type': 'field',
            'msg': 'Invalid value for Allow Basic Users Posts',
            'path': 'allow_basic_user_posts',
            'location': 'body',
        },
        {
            'type': 'field',
            'value': '',
            'msg': 'Invalid value',
            'path': 'type',
            'location': 'body',
        },
        {
            'type': 'field',
            'value': '',
            'msg': 'Community Topics are required',
            'path': 'topics',
            'location': 'body',
        },
    ],
});
      });

      it('should handle not allowing allow_basic_users_posts to be false in public community', async () => {
        const response = await sendRequest({ ...mockCommunity, allow_basic_user_posts: false });

        expect(response.body).toMatchObject({
          errors: [
            {
              type: 'field',
              value: false,
              msg: 'You can only change Allow Basic Users posts if the community is not public',
              path: 'allow_basic_user_posts',
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

  describe('PUT /community/mod/settings', () => {
    const mockEditRequest = {
      community_name: 'testcommunity',
      description: 'Updated description',
      community_type: 'PUBLIC',
      is_mature: false,
      allow_basic_user_posts: true,
      is_post_flair_required: false,
      profile_picture_url: 'https://example.com/profile.jpg',
      banner_url_desktop: 'https://example.com/banner_desktop.jpg',
      banner_url_mobile: 'https://example.com/banner_mobile.jpg',
    };

    const mockFoundCommunity = {
      id: 'community123',
      name: 'testcommunity',
      allow_basic_user_posts: true,
    };

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.getByName.mockResolvedValue(mockFoundCommunity);
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.communityFlair.getPostFlairCount.mockResolvedValue(1);
      mockDb.community.editCommunitySettings.mockResolvedValue(undefined);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .put('/community/mod/settings')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully edit community settings', async () => {
        const response = await sendRequest(mockEditRequest);

        assert.exp(response, 200, 'Successfully edited community');
        expect(mockDb.community.editCommunitySettings).toHaveBeenCalledWith(
          mockEditRequest.community_name,
          {
            description: mockEditRequest.description,
            type: mockEditRequest.community_type,
            is_mature: mockEditRequest.is_mature,
            allow_basic_user_posts: mockEditRequest.allow_basic_user_posts,
            is_post_flair_required: mockEditRequest.is_post_flair_required,
            profile_picture_url: mockEditRequest.profile_picture_url,
            banner_url_desktop: mockEditRequest.banner_url_desktop,
            banner_url_mobile: mockEditRequest.banner_url_mobile,
          },
          mockFoundCommunity.allow_basic_user_posts,
        );
      });

      it('should handle partial updates', async () => {
        const partialRequest = {
          community_name: 'testcommunity',
          description: 'New description only',
        };

        const response = await sendRequest(partialRequest);

        assert.exp(response, 200, 'Successfully edited community');
        expect(mockDb.community.editCommunitySettings).toHaveBeenCalledWith(
          partialRequest.community_name,
          {
            description: partialRequest.description,
            type: undefined,
            is_mature: undefined,
            allow_basic_user_posts: undefined,
            is_post_flair_required: undefined,
            profile_picture_url: undefined,
            banner_url_desktop: undefined,
            banner_url_mobile: undefined,
          },
          mockFoundCommunity.allow_basic_user_posts,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockEditRequest);

        assert.user.notFound(response);
      });

      it('should handle community not found', async () => {
        mockDb.community.getByName.mockResolvedValue(null);
        const response = await sendRequest(mockEditRequest);

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle user not being a moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest(mockEditRequest);

        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle invalid community type', async () => {
        const invalidRequest = {
          ...mockEditRequest,
          community_type: 'INVALID_TYPE',
        };

        const response = await sendRequest(invalidRequest);

        assert.exp(response, 500, 'Failed to edit community info');
        expect(response.body.error).toBe('Invalid community type detected');
      });

      it('should handle enabling post flair requirement without any flairs', async () => {
        mockDb.communityFlair.getPostFlairCount.mockResolvedValue(0);
        const requestWithFlairRequired = {
          ...mockEditRequest,
          is_post_flair_required: true,
        };

        const response = await sendRequest(requestWithFlairRequired);

        assert.exp(
          response,
          409,
          'You have to have at least 1 post flair to enable this setting',
        );
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockEditRequest);

        assert.dbError(response);
      });
    });
  });

  describe('GET /community/is-name-available', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.community.doesExistByName.mockResolvedValue(false);
    });

    const sendRequest = (query: any = {}) => {
      return request(app)
        .get('/community/is-name-available')
        .set('Authorization', `Bearer ${token}`)
        .query(query);
    };

    describe('Success cases', () => {
      it('should return true when name is available', async () => {
        const response = await sendRequest({ community_name: 'newcommunity' });

        assert.exp(response, 200, 'Name is free to use');
        expect(response.body.isNameAvailable).toBe(true);
      });

      it('should return false when name is taken', async () => {
        mockDb.community.doesExistByName.mockResolvedValue(true);
        const response = await sendRequest({
          community_name: 'takencommunity',
        });

        assert.exp(response, 403, 'Community Name already in use');
        expect(response.body.isNameAvailable).toBe(false);
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest({ community_name: 'testcommunity' });

        assert.user.notFound(response);
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest({ community_name: 'testcommunity' });

        assert.dbError(response);
      });
    });
  });
});

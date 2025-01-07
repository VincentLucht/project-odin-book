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
describe('/community/flair', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  const mockRequest = {
    community_id: '1',
    name: 'Test Flair',
    color: '#9B3620',
    is_assignable_to_posts: false,
    is_assignable_to_users: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockDb.user.getById.mockResolvedValue(true);
    mockDb.community.doesExistById.mockResolvedValue(true);
    mockDb.communityModerator.isMod.mockResolvedValue(true);
  });

  describe('POST /community/flair', () => {
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

        assert.community.notFound(response);
      });

      it('should handle flair already existing', async () => {
        mockDb.communityFlair.doesExist.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 409, 'Flair already exists');
      });

      it('should handle user not being a mod', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.communityModerator.notAdmin(response);
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject(
          {
            errors: [
              {
                type: 'field',
                value: '',
                msg: 'Name must be at least 1 characters long',
                path: 'name',
                location: 'body',
              },
              {
                type: 'field',
                value: '',
                msg: 'Community ID is required',
                path: 'community_id',
                location: 'body',
              },
              {
                type: 'field',
                value: '',
                msg: 'color is required',
                path: 'color',
                location: 'body',
              },
              {
                type: 'field',
                value: '',
                msg: 'Color must be a valid hex code starting with "#"',
                path: 'color',
                location: 'body',
              },
              {
                type: 'field',
                msg: 'Invalid value',
                path: 'is_assignable_to_posts',
                location: 'body',
              },
              {
                type: 'field',
                msg: 'Invalid value',
                path: 'is_assignable_to_users',
                location: 'body',
              },
            ],
          },
        );
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });
});

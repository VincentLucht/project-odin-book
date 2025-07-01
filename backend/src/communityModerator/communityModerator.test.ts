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
describe('/community/mod', () => {
  const token = generateToken(mockUser.id, mockUser.username);

  const mockRequest = {
    community_id: '1',
    username: 'targetuser',
  };

  const mockTargetUser = {
    id: '2',
    username: 'targetuser',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/mod/user', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.user.getByUsername.mockResolvedValue(mockTargetUser);
      mockDb.community.doesExistById.mockResolvedValue(true);
      mockDb.community.isOwner.mockResolvedValue(true);
      mockDb.communityModerator.isMod.mockResolvedValue(false);
      mockDb.communityModerator.makeMod.mockResolvedValue(true);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/mod/user')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully make another user a mod', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully made user mod');
        expect(mockDb.communityModerator.makeMod).toHaveBeenCalledWith(
          mockRequest.community_id,
          mockTargetUser.id,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user themselves not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle target user not existing', async () => {
        mockDb.user.getByUsername.mockResolvedValue(null);
        const response = await sendRequest(mockRequest);

        assert.user.notFound(response);
      });

      it('should handle community not existing', async () => {
        mockDb.community.doesExistById.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.community.notFound(response);
      });

      it('should handle user not being the owner', async () => {
        mockDb.community.isOwner.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Only the owner of this community can assign moderator roles');
      });

      it('should handle target user already being a mod', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(true);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'This user already is a moderator');
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject(
          {
            'errors': [
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
                'msg': 'Username is required',
                'path': 'username',
                'location': 'body',
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

  describe('DELETE /community/mod/user', () => {
    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.user.getByUsername.mockResolvedValue(mockTargetUser);
      mockDb.community.doesExistById.mockResolvedValue(true);
      mockDb.community.isOwner.mockResolvedValue(true);
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.communityModerator.delete.mockResolvedValue(true);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .delete('/community/mod/user')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully remove mod status', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully removed mod status');
        expect(mockDb.communityModerator.delete).toHaveBeenCalledWith(
          mockRequest.community_id,
          mockTargetUser.id,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not being the owner', async () => {
        mockDb.community.isOwner.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'Only the owner of this community can remove moderator roles');
      });

      it('should handle target user not being a mod', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest(mockRequest);

        assert.exp(response, 403, 'This user is not a moderator');
      });

      it('should handle db error', async () => {
        mockDb.user.getById.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockRequest);

        assert.dbError(response);
      });
    });
  });

  describe('DELETE /community/mod/user/leave', () => {
  beforeEach(() => {
    mockDb.user.getById.mockResolvedValue(mockUser);
    mockDb.community.doesExistById.mockResolvedValue(true);
    mockDb.community.isOwner.mockResolvedValue(false);
    mockDb.communityModerator.isMod.mockResolvedValue(true);
    mockDb.communityModerator.delete.mockResolvedValue(true);
  });

  const sendRequest = (body: any) => {
    return request(app)
      .delete('/community/mod/user/leave')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
  };

  describe('Success cases', () => {
    it('should successfully remove own mod status', async () => {
      const response = await sendRequest(mockRequest);
      assert.exp(response, 200, 'Successfully removed mod status');
      expect(mockDb.communityModerator.delete).toHaveBeenCalledWith(
        mockRequest.community_id,
        mockUser.id,
      );
    });
  });

  describe('Error cases', () => {
    it('should handle user not found', async () => {
      mockDb.user.getById.mockResolvedValue(null);
      const response = await sendRequest(mockRequest);
      assert.exp(response, 404, 'User not found');
    });

    it('should handle community not found', async () => {
      mockDb.community.doesExistById.mockResolvedValue(false);
      const response = await sendRequest(mockRequest);
      assert.exp(response, 404, 'Community not found');
    });

    it('should handle user not being a moderator', async () => {
      mockDb.communityModerator.isMod.mockResolvedValue(false);
      const response = await sendRequest(mockRequest);
      assert.exp(response, 403, 'You are not a moderator');
    });

    it('should handle owner trying to leave mod status', async () => {
      mockDb.community.isOwner.mockResolvedValue(true);
      const response = await sendRequest(mockRequest);
      assert.exp(response, 403, 'As the owner, you can not forfeit your moderator status');
    });

    it('should handle db error', async () => {
      mockDb.user.getById.mockRejectedValue(new Error('DB error'));
      const response = await sendRequest(mockRequest);
      assert.dbError(response);
    });
  });
});
});

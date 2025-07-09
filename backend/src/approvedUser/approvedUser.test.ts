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

describe('/community/user/approved', () => {
  const token = generateToken(mockUser.id, mockUser.username);
  const mockCommunity = { id: '1', type: 'PRIVATE', owner_id: 't1' };
  const mockApprovedUser = { id: '2', username: 'approved_user' };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/user/approved', () => {
    beforeEach(() => {
      mockDb.user.getById.mockImplementation((id) => {
        if (id === mockUser.id) return Promise.resolve(mockUser);
        return Promise.resolve(null);
      });
      mockDb.user.getByUsername.mockImplementation((username) => {
        if (username === 'approved_user') {
          return Promise.resolve(mockApprovedUser);
        }
        return Promise.resolve(null);
      });
      mockDb.community.getById.mockResolvedValue({ type: 'PUBLIC' });
      mockDb.approvedUser.isApproved.mockResolvedValue(false);
      mockDb.communityModerator.isMod.mockResolvedValue(true);
      mockDb.bannedUsers.isBanned.mockResolvedValue(false);
      mockDb.approvedUser.create.mockResolvedValue(true);
    });

    const sendRequest = (
      community_id = '1',
      approved_username = 'approved_user',
    ) => {
      return request(app)
        .post('/community/user/approved')
        .set('Authorization', `Bearer ${token}`)
        .send({ community_id, approved_username });
    };

    describe('Success cases', () => {
      it('should successfully approve user', async () => {
        const response = await sendRequest();

        assert.exp(response, 201, 'Successfully approved user');
        expect(mockDb.approvedUser.create).toHaveBeenCalledWith('1', '2');
      });
    });

    describe('Error cases', () => {
      it('should handle auth user not found', async () => {
        mockDb.user.getById.mockImplementation(() => {
          return Promise.resolve(null);
        });

        const response = await sendRequest();
        assert.exp(response, 404, 'User not found');
      });

      it('should handle approved user not found', async () => {
        mockDb.user.getByUsername.mockImplementation(() => {
          return Promise.resolve(null);
        });
        const response = await sendRequest();

        assert.exp(response, 404, 'User not found');
      });

      it('should handle community not found', async () => {
        mockDb.community.getById.mockResolvedValue(false);
        const response = await sendRequest();

        assert.exp(response, 404, 'Community not found');
      });

      it('should handle user already approved', async () => {
        mockDb.approvedUser.isApproved.mockResolvedValue(true);
        const response = await sendRequest();

        assert.exp(response, 400, 'This user is already approved');
      });

      it('should handle user not being a moderator', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest();

        assert.exp(response, 403, 'You are not a moderator');
      });

      it('should approved user being banned', async () => {
        mockDb.bannedUsers.isBanned.mockResolvedValueOnce(true);
        const response = await sendRequest();

        assert.exp(response, 403, 'You can not approve a user that is banned');
      });

      it('should handle missing community_id', async () => {
        const response = await request(app)
          .post('/community/user/approved')
          .set('Authorization', `Bearer ${token}`)
          .send({ approved_username: 'approved_user' });

        expect(response.status).toBe(400);
      });

      it('should handle missing approved_username', async () => {
        const response = await request(app)
          .post('/community/user/approved')
          .set('Authorization', `Bearer ${token}`)
          .send({ community_id: '1' });

        expect(response.status).toBe(400);
      });

      it('should handle database error', async () => {
        mockDb.approvedUser.create.mockRejectedValue(
          new Error('Database error'),
        );
        const response = await sendRequest();

        assert.exp(response, 500, 'Failed to approve user');
      });
    });
  });

  describe('DELETE /community/user/approved', () => {
    beforeEach(() => {
      mockDb.user.getById.mockImplementation((id) => {
        if (id === mockUser.id) return Promise.resolve(mockUser);
        if (id === 't1') {
          return Promise.resolve({ id: 't1', username: 'owner' });
        }
        return Promise.resolve(null);
      });
      mockDb.user.getByUsername.mockImplementation((username) => {
        if (username === 'approved_user') {
          return Promise.resolve(mockApprovedUser);
        }
        if (username === 'owner') {
          return Promise.resolve({ id: 't1', username: 'owner' });
        }
        return Promise.resolve(null);
      });
      mockDb.community.getById.mockResolvedValue(mockCommunity);
      mockDb.approvedUser.isApproved.mockResolvedValue(true);
      mockDb.communityModerator.isMod.mockImplementation((userId) => {
        if (userId === mockUser.id) return Promise.resolve(true);
        return Promise.resolve(false);
      });
      mockDb.approvedUser.delete.mockResolvedValue(true);
    });

    const sendRequest = (
      community_id = '1',
      approved_username = 'approved_user',
    ) => {
      return request(app)
        .delete('/community/user/approved')
        .set('Authorization', `Bearer ${token}`)
        .send({ community_id, approved_username });
    };

    describe('Success cases', () => {
      it('should successfully unapprove user', async () => {
        const response = await sendRequest();
        assert.exp(response, 200, 'Successfully unapproved user');

        expect(mockDb.approvedUser.delete).toHaveBeenCalledWith('1', '2', true);
      });

      it('should allow moderator to unapprove themselves', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(true);
        const response = await sendRequest('1', 'approved_user');

        assert.exp(response, 200, 'Successfully unapproved user');
      });

      it('should allow owner to unapprove other moderators', async () => {
        const ownerToken = generateToken('t1', 'owner');
        mockDb.communityModerator.isMod.mockImplementation((userId) => {
          return Promise.resolve(userId === 't1' || userId === '2');
        });
        const response = await request(app)
          .delete('/community/user/approved')
          .set('Authorization', `Bearer ${ownerToken}`)
          .send({ community_id: '1', approved_username: 'approved_user' });

        assert.exp(response, 200, 'Successfully unapproved user');
      });
    });

    describe('Error cases', () => {
      it('should handle auth user not found', async () => {
        mockDb.user.getById.mockImplementation(() => {
          return Promise.resolve(null);
        });
        const response = await sendRequest();

        assert.exp(response, 404, 'User not found');
      });

      it('should handle approved user not found', async () => {
        mockDb.user.getByUsername.mockImplementation(() => {
          return Promise.resolve(null);
        });
        const response = await sendRequest();

        assert.exp(response, 404, 'User not found');
      });

      it('should handle community not found', async () => {
        mockDb.community.getById.mockResolvedValue(null);
        const response = await sendRequest();
        assert.exp(response, 404, 'Community not found');
      });

      it('should handle trying to unapprove community owner', async () => {
        const response = await sendRequest('1', 'owner');

        assert.exp(
          response,
          403,
          'You can not unnaprove the owner of this community',
        );
      });

      it('should handle user not being approved', async () => {
        mockDb.approvedUser.isApproved.mockResolvedValue(false);
        const response = await sendRequest();

        assert.exp(response, 400, 'This user is not approved');
      });

      it('should handle non-moderator trying to unapprove', async () => {
        mockDb.communityModerator.isMod.mockResolvedValue(false);
        const response = await sendRequest();

        assert.exp(response, 403, 'You are not a moderator');
      });

      it('should handle non-owner moderator trying to unapprove other moderators', async () => {
        // Make user t2 (mod) try to unapprove user 3 (also mod)
        const modToken = generateToken('t2', 'moderator');
        mockDb.communityModerator.isMod.mockImplementation((userId) => {
          return Promise.resolve(userId === 't2' || userId === '3');
        });

        // Add other mock moderator
        mockDb.user.getById.mockImplementation((id) => {
          if (id === mockUser.id) return Promise.resolve(mockUser);
          if (id === 't1') {
            return Promise.resolve({ id: 't1', username: 'owner' });
          }
          if (id === 't2') {
            return Promise.resolve({ id: 't2', username: 'moderator' });
          }
          return Promise.resolve(null);
        });
        mockDb.user.getByUsername.mockImplementation((username) => {
          if (username === 'approved_user') {
            return Promise.resolve(mockApprovedUser);
          }
          if (username === 'owner') {
            return Promise.resolve({ id: 't1', username: 'owner' });
          }
          if (username === 'moderator') {
            return Promise.resolve({ id: 't2', username: 'moderator' });
          }
          if (username === 'user3') {
            return Promise.resolve({ id: '3', username: 'user3' });
          }
          return Promise.resolve(null);
        });

        const response = await request(app)
          .delete('/community/user/approved')
          .set('Authorization', `Bearer ${modToken}`)
          .send({ community_id: '1', approved_username: 'user3' });

        assert.exp(response, 403, 'You can not unapprove other moderators');
      });

      it('should handle missing community_id', async () => {
        const response = await request(app)
          .delete('/community/user/approved')
          .set('Authorization', `Bearer ${token}`)
          .send({ approved_username: 'approved_user' });

        expect(response.status).toBe(400);
      });

      it('should handle missing approved_username', async () => {
        const response = await request(app)
          .delete('/community/user/approved')
          .set('Authorization', `Bearer ${token}`)
          .send({ community_id: '1' });

        expect(response.status).toBe(400);
      });

      it('should handle database error', async () => {
        mockDb.approvedUser.delete.mockRejectedValue(
          new Error('Database error'),
        );
        const response = await sendRequest();

        assert.exp(response, 500, 'Failed to unapprove users');
      });
    });
  });
});

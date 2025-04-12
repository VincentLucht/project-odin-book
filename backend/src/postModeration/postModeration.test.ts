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
describe('/community/mod/post', () => {
  const token = generateToken(mockUser.id, mockUser.username);
  const mockRequest = {
    post_id: '1',
    reason: 'Violates community guidelines',
    moderation_action: 'REMOVED',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('POST /community/mod/post', () => {
    const moderatorId = 'mod-123';

    beforeEach(() => {
      mockDb.user.getById.mockResolvedValue(true);
      mockDb.post.getByIdAndModerator.mockResolvedValue({
        id: '1',
        community_id: '2',
        moderation: null,
      });
      mockDb.communityModerator.getById.mockResolvedValue({
        id: moderatorId,
        user_id: mockUser.id,
        community_id: '2',
        is_active: true,
      });
      mockDb.postModeration.moderate.mockResolvedValue(true);
      mockDb.postModeration.updateModeration.mockResolvedValue(true);
    });

    const sendRequest = (body: any) => {
      return request(app)
        .post('/community/mod/post')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    };

    describe('Success cases', () => {
      it('should successfully create post moderation', async () => {
        const response = await sendRequest(mockRequest);

        assert.exp(response, 201, 'Successfully moderated post');
        expect(mockDb.postModeration.moderate).toHaveBeenCalledWith(
          mockRequest.post_id,
          moderatorId,
          mockRequest.moderation_action,
          mockRequest.reason,
        );
      });

      it('should successfully update post moderation', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue({
          id: '1',
          community_id: '2',
          moderation: {
            moderator_id: moderatorId,
          },
        });

        const response = await sendRequest(mockRequest);

        assert.exp(response, 200, 'Successfully updated post moderation');
        expect(mockDb.postModeration.updateModeration).toHaveBeenCalledWith(
          mockRequest.post_id,
          'REMOVED',
          mockRequest.reason,
        );
      });
    });

    describe('Error cases', () => {
      it('should handle user not existing', async () => {
        mockDb.user.getById.mockResolvedValue(false);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 404, 'User not found');
      });

      it('should handle post not existing', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 404, 'Post not found');
      });

      it('should handle user not being a mod', async () => {
        mockDb.communityModerator.getById.mockResolvedValue(null);

        const response = await sendRequest(mockRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
      });

      it('should handle post already being moderated by another user', async () => {
        mockDb.post.getByIdAndModerator.mockResolvedValue({
          id: '1',
          community_id: '2',
          moderation: {
            moderator_id: 'different-moderator-id',
          },
        });

        const response = await sendRequest(mockRequest);
        assert.exp(response, 409, 'This post was already moderated by another user');
      });

      it('should handle user being inactive mode', async () => {
        mockDb.communityModerator.getById.mockResolvedValue({ is_active: false });

        const response = await sendRequest(mockRequest);
        assert.exp(response, 403, 'You are not a moderator in this community');
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
              'msg': 'Moderation action is required',
              'path': 'moderation_action',
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

  describe('DELETE /community/mod/user', () => {
  //   beforeEach(() => {
  //     mockDb.user.getById.mockResolvedValue(true);
  //     mockDb.community.doesExistById.mockResolvedValue(true);
  //     mockDb.communityModerator.isMod.mockResolvedValueOnce(true);
  //     mockDb.communityModerator.isMod.mockResolvedValueOnce(true);
  //     mockDb.communityModerator.delete.mockResolvedValue(true);
  //   });

  //   const sendRequest = (body: any) => {
  //     return request(app)
  //       .delete('/community/mod/user')
  //       .set('Authorization', `Bearer ${token}`)
  //       .send(body);
  //   };

  //   describe('Success cases', () => {
  //     it('should successfully remove mod status', async () => {
  //       const response = await sendRequest(mockRequest);

  //       assert.exp(response, 201, 'Successfully removed mod status');
  //     });
  //   });

  //   describe('Error cases', () => {
  //     it('should handle target user not being a mod', async () => {
  //       mockDb.communityModerator.isMod.mockReset();
  //       mockDb.communityModerator.isMod.mockResolvedValueOnce(true);
  //       mockDb.communityModerator.isMod.mockResolvedValueOnce(false);
  //       const response = await sendRequest(mockRequest);

  //       assert.exp(response, 403, 'This user is not a moderator');
  //     });

  //     it('should handle db error', async () => {
  //       mockDb.user.getById.mockRejectedValue(new Error('DB error'));
  //       const response = await sendRequest(mockRequest);

  //       assert.dbError(response);
  //     });
  //   });
  });
});

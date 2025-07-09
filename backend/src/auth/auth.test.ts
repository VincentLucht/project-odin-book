import * as dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import express from 'express';
import router from '@/routes/router';

import db from '@/db/db';
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

jest.mock('@/db/db');
jest.mock('bcrypt');

import mockDb from '@/util/test/mockDb';

// prettier-ignore
describe('Auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    mockDb.user.getByUsername.mockResolvedValue(null);
    mockDb.user.getByEmail.mockResolvedValue(null);
  });

  const mockUser = {
    name: 't1',
    username: 't1',
    email: 't1',
    password: 't1',
    confirm_password: 't1',
  };

  describe('POST /sign-up', () => {
    const sendRequest = (body: any) => {
      return request(app)
        .post('/auth/sign-up')
        .send(body);
    };

    describe('Success cases', () => {
      it('should create an user', async () => {
        const response = await sendRequest(mockUser);

        assert.exp(response, 201, 'User created successfully');
        expect(db.user.create).toHaveBeenCalled();
      });
    });

    describe('Error cases', () => {
      it('should handle an username already being used', async () => {
        mockDb.user.getByUsername.mockResolvedValue(true);
        const response = await sendRequest(mockUser);

        assert.exp(response, 409, 'Username already in use');
        expect(db.user.getByUsername).toHaveBeenCalledWith(mockUser.username);
        expect(db.user.create).not.toHaveBeenCalled();
      });

      it('should handle an email already being used', async () => {
        mockDb.user.getByEmail.mockResolvedValue(true);
        const response = await sendRequest(mockUser);

        assert.exp(response, 409, 'Email already in use');
        expect(db.user.create).not.toHaveBeenCalled();
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body).toMatchObject({
          'errors': [
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Username is required',
                  'path': 'username',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Email must be at least 1 characters long',
                  'path': 'email',
                  'location': 'body',
              },
              {
                  'type': 'field',
                  'value': '',
                  'msg': 'Password must be at least 1 characters long',
                  'path': 'password',
                  'location': 'body',
              },
          ],
        });
        expect(db.user.create).not.toHaveBeenCalled();
      });

      it('should handle db error', async () => {
        mockDb.user.getByUsername.mockRejectedValue(new Error('DB error'));
        const response = await sendRequest(mockUser);

        assert.dbError(response);
      });
    });
  });
});

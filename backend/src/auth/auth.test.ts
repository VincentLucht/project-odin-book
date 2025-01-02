import * as dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import express from 'express';
import router from '@/routes/router';
import db from '@/db/db';

import mockChecker from '@/util/test/mockChecker';

const app = express();
app.use(express.json());
app.use('', router);

jest.mock('@/db/db');
jest.mock('bcrypt');
jest.mock('@/util/checker/checker');

// prettier-ignore
describe('/auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
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

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(db.user.create).toHaveBeenCalled();
      });
    });

    describe('Error cases', () => {
      it('should handle an username already being used', async () => {
        mockChecker.mockUserExistenceCheck(409, 'User already exists');
        const response = await sendRequest(mockUser);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User already exists');
        expect(db.user.create).not.toHaveBeenCalled();
      });

      it('should handle an email already being used', async () => {
        mockChecker.mockEmailExistenceCheck(409, 'Email already in use');
        const response = await sendRequest(mockUser);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Email already in use');
        expect(db.user.create).not.toHaveBeenCalled();
      });

      it('should handle missing inputs', async () => {
        const response = await sendRequest({});

        expect(response.body.errors.length).toBe(3);
      });

      it('should handle db error', async () => {
        mockChecker.mockDbError();
        const response = await sendRequest(mockUser);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database error');
      });
    });
  });
});

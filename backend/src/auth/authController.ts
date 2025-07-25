import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '@/db/db';

import { checkValidationError } from '@/util/checkValidationError';

type User = {
  id: string;
  name: string;
  password: string;
};

export interface AuthenticatedRequest extends Request {
  user?: User;
  title?: string;
}

class AuthController {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.SECRET_KEY || '';
    if (!this.secretKey) {
      throw new Error('SECRET_KEY is not defined in environment variables');
    }
    // bind .this to methods
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response) {
    if (checkValidationError(req, res)) return;

    const { username, password } = req.body;

    try {
      const user = await db.user.getByUsername(username);

      if (user && (await bcrypt.compare(password, user.password))) {
        const payload = {
          ...user,
          password: null,
        };
        const token = jwt.sign(payload, this.secretKey, {
          expiresIn: '14 days',
        });
        return res.json({ token: `Bearer ${token}` });
      } else {
        return res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  async signUp(req: Request, res: Response) {
    if (checkValidationError(req, res)) return;

    const { username, email, password } = req.body;

    try {
      if (await db.user.getByUsername(username)) {
        return res.status(409).json({ message: 'Username already in use' });
      }
      if (await db.user.getByEmail(email)) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      await db.user.create(username, email, await bcrypt.hash(password, 10));

      return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

const authController = new AuthController();
export default authController;

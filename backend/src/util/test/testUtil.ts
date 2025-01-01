import jwt from 'jsonwebtoken';

export const mockUser = {
  id: 't1',
  username: 't1',
  email: 't1',
  password: 't1',
  display_name: 't1',
  profile_picture_url: 't1',
  description: 't1',
  cake_day: 't1',
  created_at: Date.now(),
};

export const generateToken = (userId: string, name: string) => {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.sign({ id: userId, name }, secretKey, { expiresIn: '5m' });
};

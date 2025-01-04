import { CommunityType } from '@prisma/client/default';
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
  created_at: new Date(),
};

export const mockCommunity = {
  id: '1',
  name: 'mc',
  description: 'desc',
  profile_picture_url_desktop: 'https://example.com/profile-pic-desktop.jpg',
  profile_picture_url_mobile: 'https://example.com/profile-pic-mobile.jpg',
  banner_url: 'https://example.com/banner.jpg',
  is_mature: false,
  created_at: new Date(),
  owner_id: 't1',
  type: CommunityType.PUBLIC,
  topics: ['topic1', 'topic2'],
};

export const generateToken = (userId: string, username: string) => {
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

  return jwt.sign({ id: userId, username }, secretKey, {
    expiresIn: '5m',
  });
};

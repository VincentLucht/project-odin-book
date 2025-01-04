import jwt from 'jsonwebtoken';

export default function getAuthUser(
  authData: string | jwt.JwtPayload | undefined,
) {
  if (!authData || typeof authData === 'string') {
    throw new Error('Invalid auth data');
  }

  if (!authData.id) {
    throw new Error('Missing user_id in token');
  }

  return { user_id: authData.id };
}

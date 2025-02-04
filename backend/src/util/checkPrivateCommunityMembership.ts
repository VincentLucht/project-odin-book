import { Post } from '@prisma/client/default';
import { DB } from '@/db/db';
import { Request, Response } from 'express';

import getAuthUser from '@/util/getAuthUser';

export default async function checkPrivateCommunityMembership(
  db: DB,
  post: Post,
  userId: undefined,
  req: Request,
  res: Response,
) {
  const community = await db.community.getById(post.community_id);
  if (!community) {
    return res.status(404).json({ message: 'Community not found' });
  }

  if (community.type === 'PRIVATE') {
    if (!req.authData) {
      return res.status(401).json({
        message: 'Authentication required for private community content',
      });
    }

    const { user_id } = getAuthUser(req.authData);
    userId = user_id;

    const isMember = await db.userCommunity.isMember(user_id, community.id);
    if (!isMember) {
      return res
        .status(403)
        .json({ message: 'You are not part of this community' });
    }

    if (await db.bannedUsers.isBanned(user_id, community.id)) {
      return res
        .status(403)
        .json({ message: 'You are banned from this community' });
    }
  }

  return userId;
}

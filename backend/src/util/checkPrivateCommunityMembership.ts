import getAuthUser from '@/util/getAuthUser';

import { Post } from '@prisma/client/default';
import { DB } from '@/db/db';
import { JwtPayload } from 'jsonwebtoken';
import { AuthPayload } from '@/comment/commentController';

export default async function checkPrivateCommunityMembership(
  db: DB,
  post: { community_id: string } | Post,
  authData: string | JwtPayload | undefined,
  returnUserId = false,
) {
  const community = await db.community.getById(post.community_id);
  if (!community) {
    return { ok: false, status: 404, message: 'Community not found' };
  }

  if (community.type === 'PRIVATE') {
    if (!authData) {
      return {
        ok: false,
        status: 401,
        message: 'Authentication required for private community content',
      };
    }

    const { user_id } = getAuthUser(authData);

    const isMember = await db.userCommunity.isMember(user_id, community.id);
    if (!isMember) {
      return {
        ok: false,
        status: 403,
        message: 'You are not part of this community',
      };
    }

    if (await db.bannedUsers.isBanned(user_id, community.id)) {
      return {
        ok: false,
        status: 403,
        message: 'You are banned from this community',
      };
    }

    if (returnUserId) {
      return { ok: true, user_id };
    }
  }

  let user_id = undefined;
  if (authData) {
    const { id } = authData as AuthPayload;
    user_id = id;
  }
  return { ok: true, user_id };
}

import { Community } from '.prisma/client';

interface CheckCommunityPermissions {
  db: any;
  userId: string;
  community: Community;
  action: 'post' | 'comment';
}

// Check posting permissions based on community type and if basic users are allowed an action
export default async function ({
  db,
  userId,
  community,
  action = 'post',
}: CheckCommunityPermissions) {
  if (community.type === 'PUBLIC') {
    return { isAllowed: true };
  }

  const member = await db.userCommunity.getById(userId, community.id);
  if (!member) {
    return {
      isAllowed: false,
      status: 403,
      message: `You must be a member of this community to ${action}`,
    };
  }

  if (community.type === 'RESTRICTED' && member.role !== 'CONTRIBUTOR') {
    return {
      isAllowed: false,
      status: 403,
      message: 'Only Contributors can post in restricted communities',
    };
  }

  if (
    community.type === 'PRIVATE' &&
    !community.allow_basic_user_posts &&
    member.role === 'BASIC'
  ) {
    return {
      isAllowed: false,
      status: 403,
      message: `Basic users cannot ${action} in this community`,
    };
  }

  return { isAllowed: true };
}

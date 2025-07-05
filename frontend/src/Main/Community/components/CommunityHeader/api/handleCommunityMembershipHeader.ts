import joinCommunity from '@/Main/Community/api/joinCommunity';
import catchError from '@/util/catchError';
import leaveCommunity from '@/Main/Community/api/leaveCommunity';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { UserRoles } from '@/interface/dbSchema';

export default async function handleCommunityMembershipHeader(
  community: FetchedCommunity,
  user_id: string,
  token: string,
  onCommunityUpdate: (updatedCommunity: FetchedCommunity | null) => void,
  wasMember: boolean,
) {
  const previousState: FetchedCommunity | null = { ...community };

  const handleMembership = (community: FetchedCommunity, wasMember: boolean) => {
    return {
      ...community,
      is_moderator: wasMember ? false : true,
      community_moderators: community.community_moderators.map((mod) => {
        if (mod.user.id !== user_id) return mod;

        return mod.is_active
          ? { ...mod, is_active: false }
          : { ...mod, is_active: true };
      }),
      user_communities: wasMember ? [] : [{ user_id, role: 'BASIC' as UserRoles }],
    };
  };

  const updatedCommunity = handleMembership(community, wasMember);
  onCommunityUpdate(updatedCommunity);

  try {
    if (wasMember) {
      await leaveCommunity(community.id, token);
    } else {
      await joinCommunity(community.id, token);
    }
  } catch (error) {
    if (previousState) {
      const errorObj = error as { message: string };
      if (errorObj.message === 'You already are a member of this community') {
        const fixedCommunity = handleMembership(community, false);
        onCommunityUpdate(fixedCommunity);
      } else if (errorObj.message === 'You are not part of this community') {
        const fixedCommunity = handleMembership(community, false);
        onCommunityUpdate(fixedCommunity);
      } else {
        onCommunityUpdate(previousState);
        catchError(error);
      }
    }
  }
}

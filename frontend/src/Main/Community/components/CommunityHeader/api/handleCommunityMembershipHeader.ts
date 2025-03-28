import joinCommunity from '@/Main/Community/api/joinCommunity';
import catchError from '@/util/catchError';
import leaveCommunity from '@/Main/Community/api/leaveCommunity';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';
import { UserRoles } from '@/interface/dbSchema';

export default async function handleCommunityMembershipHeader(
  community: FetchedCommunity,
  user_id: string,
  token: string,
  setCommunity: React.Dispatch<React.SetStateAction<FetchedCommunity | null>>,
  wasMember: boolean,
) {
  const previousState: FetchedCommunity | null = { ...community };

  const handleMembership = (community: FetchedCommunity, wasMember: boolean) => {
    return {
      ...community,
      user_communities: wasMember ? [] : [{ user_id, role: 'BASIC' as UserRoles }],
    };
  };

  setCommunity((prev) => {
    if (!prev) return prev;

    return handleMembership(prev, wasMember);
  });

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
        setCommunity((prev) => {
          if (!prev) return prev;

          return handleMembership(prev, false);
        });
      } else if (errorObj.message === 'You are not part of this community') {
        setCommunity((prev) => {
          if (!prev) return prev;

          return handleMembership(prev, true);
        });
      } else {
        setCommunity(previousState);
        catchError(error);
      }
    }
  }
}

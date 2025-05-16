import joinCommunity from '@/Main/Community/api/joinCommunity';
import catchError from '@/util/catchError';
import leaveCommunity from '@/Main/Community/api/leaveCommunity';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';

export default async function handleCommunityMembership(
  community_id: string,
  user_id: string,
  token: string,
  setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>,
  wasMember: boolean,
) {
  let previousState = null;

  const handleMembership = (value: UserHistoryItem, wasMember: boolean) => {
    if (value.item_type === 'post' && value.community.id === community_id) {
      return {
        ...value,
        community: {
          ...value.community,
          user_communities: wasMember ? [] : [{ user_id }],
        },
      };
    }

    return value;
  };

  setUserHistory((prev) => {
    if (!prev) return prev;
    previousState = prev;

    return prev.map((value) => handleMembership(value, wasMember));
  });

  try {
    if (wasMember) {
      await leaveCommunity(community_id, token);
    } else {
      await joinCommunity(community_id, token);
    }
  } catch (error) {
    if (previousState) {
      const errorObj = error as { message: string };
      if (errorObj.message === 'You already are a member of this community') {
        setUserHistory((prev) => {
          if (!prev) return prev;

          return prev.map((value) => handleMembership(value, wasMember));
        });
      } else if (errorObj.message === 'You are not part of this community') {
        setUserHistory((prev) => {
          if (!prev) return prev;

          return prev.map((value) => handleMembership(value, wasMember));
        });
      } else {
        setUserHistory(previousState);
        catchError(error);
      }
    }
  }
}

import joinCommunity from '@/Main/Community/api/joinCommunity';
import catchError from '@/util/catchError';
import isPost from '@/Main/user/UserProfile/util/isPost';
import leaveCommunity from '@/Main/Community/api/leaveCommunity';

import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import {
  DBPostWithCommunityName,
  DBCommentWithCommunityName,
} from '@/interface/dbSchema';

export default async function handleCommunityMembership(
  community_id: string,
  user_id: string,
  token: string,
  setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>,
  wasMember: boolean,
) {
  let previousState: UserAndHistory | null = null;

  const handleMembership = (
    value: DBPostWithCommunityName | DBCommentWithCommunityName,
    wasMember: boolean,
  ) => {
    if (isPost(value) && value.community.id === community_id) {
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

  setFetchedUser((prev) => {
    if (!prev) return prev;
    previousState = prev;

    return {
      ...prev,
      history: prev.history.map((value) => handleMembership(value, wasMember)),
    };
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
        setFetchedUser((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            history: prev.history.map((value) => handleMembership(value, false)),
          };
        });
      } else if (errorObj.message === 'You are not part of this community') {
        setFetchedUser((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            history: prev.history.map((value) => handleMembership(value, true)),
          };
        });
      } else {
        setFetchedUser(previousState);
        catchError(error);
      }
    }
  }
}

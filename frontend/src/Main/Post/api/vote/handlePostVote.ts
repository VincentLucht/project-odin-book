import deletePostVote from '@/Main/Post/api/vote/deletePostVote';
import postVote from '@/Main/Post/api/vote/postVote';
import catchError from '@/util/catchError';
import getNewScore from '@/util/getNewScore';

import { VoteType } from '@/interface/backendTypes';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { DBPostWithCommunity } from '@/interface/dbSchema';

export default async function handlePostVote(
  post_id: string,
  userId: string,
  token: string,
  voteType: VoteType,
  setterFunc: React.Dispatch<
    React.SetStateAction<UserAndHistory | DBPostWithCommunity | null>
  >,
  previousVoteType: VoteType | undefined,
) {
  const updateFetchedUserState = (
    prev: UserAndHistory | DBPostWithCommunity | null,
    post_id: string,
    previousVoteType: VoteType | undefined,
    voteType: VoteType,
    userId: string,
  ) => {
    if (!prev) return prev;
    previousState = { ...prev };

    // UserAndHistory
    if ('history' in prev) {
      return {
        ...prev,
        history: prev.history.map((value) => {
          if (value.id === post_id) {
            return {
              ...value,
              post_votes:
                previousVoteType === voteType
                  ? []
                  : [{ user_id: userId, vote_type: voteType }],
              total_vote_score: getNewScore(
                value.total_vote_score,
                voteType,
                previousVoteType,
              ),
            };
          }
          return value;
        }),
      };
    } else {
      // DDPostWithCommunity
      return {
        ...prev,
        post_votes:
          previousVoteType === voteType
            ? []
            : [{ user_id: userId, vote_type: voteType }],
        total_vote_score: getNewScore(
          prev.total_vote_score,
          voteType,
          previousVoteType,
        ),
      };
    }
  };

  let previousState: UserAndHistory | DBPostWithCommunity | null = null;

  // Optimistic update
  setterFunc((prev) =>
    updateFetchedUserState(prev, post_id, previousVoteType, voteType, userId),
  );

  try {
    // Perform actual API call
    if (previousVoteType === voteType) {
      await deletePostVote(post_id, token);
    } else {
      await postVote(post_id, voteType, token);
    }
  } catch (error) {
    if (previousState) {
      setterFunc(previousState);
    }

    // allow to change frontend object if frontend obj is out of sync
    const errorObj = error as { message?: string };
    if (
      ('message' in errorObj &&
        errorObj.message === 'You already voted for this post') ||
      errorObj.message === 'Vote not found'
    ) {
      setterFunc((prev) =>
        updateFetchedUserState(prev, post_id, previousVoteType, voteType, userId),
      );
    } else {
      catchError(error);
    }
  }
}

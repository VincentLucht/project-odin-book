import deletePostVote from '@/Main/Post/api/vote/deletePostVote';
import postVote from '@/Main/Post/api/vote/postVote';
import catchError from '@/util/catchError';
import getNewScore from '@/util/getNewScore';

import { VoteType } from '@/interface/backendTypes';
import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { DBPostWithCommunityName } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';

export type HandlePostVoteType = React.Dispatch<
  React.SetStateAction<
    UserHistoryItem[] | DBPostWithCommunityName[] | DBPostWithCommunity | null
  >
>;

export default async function handlePostVote(
  postId: string,
  userId: string,
  token: string,
  voteType: VoteType,
  setterFunc: HandlePostVoteType,
  previousVoteType: VoteType | undefined,
) {
  const updateFetchedUserState = (
    prev: UserHistoryItem[] | DBPostWithCommunityName[] | DBPostWithCommunity | null,
    post_id: string,
    previousVoteType: VoteType | undefined,
    voteType: VoteType,
    userId: string,
  ) => {
    if (!prev) return prev;
    previousState = Array.isArray(prev) ? [...prev] : { ...prev };

    if (Array.isArray(prev)) {
      // UserHistory[]
      if (prev.length > 0 && 'item_type' in prev[0]) {
        return prev.map((value) => {
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
        }) as UserHistoryItem[];
      } else {
        // DBPostWithCommunityName[]
        return prev.map((post) => {
          if (post.id === post_id) {
            return {
              ...post,
              post_votes:
                previousVoteType === voteType
                  ? []
                  : [{ user_id: userId, vote_type: voteType }],
              total_vote_score: getNewScore(
                post.total_vote_score,
                voteType,
                previousVoteType,
              ),
            };
          }
          return post;
        }) as DBPostWithCommunityName[];
      }
    } else {
      // DBPostWithCommunity
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
      } as DBPostWithCommunity;
    }
  };

  let previousState = null;

  // Optimistic update
  setterFunc((prev) =>
    updateFetchedUserState(prev, postId, previousVoteType, voteType, userId),
  );

  try {
    // Perform actual API call
    if (previousVoteType === voteType) {
      await deletePostVote(postId, token);
    } else {
      await postVote(postId, voteType, token);
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
        updateFetchedUserState(prev, postId, previousVoteType, voteType, userId),
      );
    } else {
      catchError(error);
    }
  }
}

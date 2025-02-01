import { VoteType } from '@/interface/backendTypes';
import deletePostVote from '@/Main/Post/api/deletePostVote';
import postVote from '@/Main/Post/api/postVote';
import catchError from '@/util/catchError';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';

export default async function handlePostVote(
  post_id: string,
  userId: string,
  token: string,
  voteType: VoteType,
  setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>,
  previousVoteType: VoteType | null,
) {
  const getNewScore = (currentScore: number) => {
    if (previousVoteType === voteType) {
      // Removing vote
      return previousVoteType === 'UPVOTE' ? currentScore - 1 : currentScore + 1;
    } else {
      // Adding/Changing vote
      if (previousVoteType) {
        return voteType === 'UPVOTE' ? currentScore + 2 : currentScore - 2;
      } else {
        return voteType === 'UPVOTE' ? currentScore + 1 : currentScore - 1;
      }
    }
  };

  let previousState: UserAndHistory | null = null;

  // Optimistic update
  setFetchedUser((prev) => {
    if (!prev) return prev;
    previousState = prev;

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
            total_vote_score: getNewScore(value.total_vote_score),
          };
        }

        return value;
      }),
    };
  });

  try {
    // Perform actual API call
    if (previousVoteType === voteType) {
      await deletePostVote(post_id, token);
    } else {
      await postVote(post_id, voteType, token);
    }
  } catch (error) {
    if (previousState) {
      setFetchedUser(previousState);
    }
    catchError(error);
  }
}

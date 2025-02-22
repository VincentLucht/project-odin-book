import commentVote from '@/Main/Post/components/CommentSection/components/Comments/api/commentVote';
import deleteCommentVote from '@/Main/Post/components/CommentSection/components/Comments/api/deleteCommentVote';
import catchError from '@/util/catchError';
import isPost from '@/Main/user/UserProfile/util/isPost';
import getNewScore from '@/util/getNewScore';
import { toast } from 'react-toastify';

import { VoteType } from '@/interface/backendTypes';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';

export default async function handleCommentVoteOverview(
  commentId: string,
  userId: string | null,
  voteType: VoteType,
  previousVoteType: VoteType | undefined,
  token: string | undefined,
  setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>,
) {
  if (!userId || !token) {
    toast.error('You need to log in to vote');
    return;
  }

  let previousState: UserAndHistory | null = null;

  const updateState = () => {
    setFetchedUser((prev) => {
      if (!prev) return prev;
      previousState = { ...prev };

      const updatedHistory =
        Array.isArray(prev.history) && prev.history.length > 0
          ? prev.history.map((value) => {
              if (!isPost(value) && value.id === commentId) {
                return {
                  ...value,
                  comment_votes:
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
            })
          : prev.history;

      return { ...previousState, history: updatedHistory };
    });
  };

  updateState();

  try {
    if (voteType === previousVoteType) {
      await deleteCommentVote(commentId, token);
    } else {
      await commentVote(commentId, voteType, token);
    }
  } catch (error) {
    if (previousState) {
      setFetchedUser(previousState);
    }

    const errorObj = error as { message?: string };

    if (
      errorObj.message === 'You already voted for this comment' ||
      errorObj.message === 'Comment not found'
    ) {
      updateState();
    } else {
      catchError(error);
    }
  }
}

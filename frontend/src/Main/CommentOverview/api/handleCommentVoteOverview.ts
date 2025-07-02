import commentVote from '@/Main/Post/components/CommentSection/components/Comments/api/commentVote';
import deleteCommentVote from '@/Main/Post/components/CommentSection/components/Comments/api/deleteCommentVote';
import catchError from '@/util/catchError';
import isPost from '@/Main/user/UserProfile/util/isPost';
import getNewScore from '@/util/getNewScore';
import { toast } from 'react-toastify';

import { VoteType } from '@/interface/backendTypes';
import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { SavedComment } from '@/interface/dbSchema';

export default async function handleCommentVoteOverview(
  commentId: string,
  userId: string | null,
  voteType: VoteType,
  previousVoteType: VoteType | undefined,
  token: string | undefined,
  setUserHistory?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>,
  setSavedComments?: React.Dispatch<React.SetStateAction<SavedComment[]>>,
) {
  if (!userId || !token) {
    toast.error('You need to log in to vote');
    return;
  }

  let previousState = null;

  const updateState = () => {
    setUserHistory?.((prev) => {
      if (!prev) return prev;
      previousState = [...prev];

      return prev.map((value) => {
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
      });
    });

    setSavedComments?.((prev) => {
      if (!prev) return prev;
      previousState = [...prev];

      return prev.map((comment) => {
        return comment.id === commentId
          ? {
              ...comment,
              comment_votes:
                previousVoteType === voteType
                  ? []
                  : [{ user_id: userId, vote_type: voteType }],
              total_vote_score: getNewScore(
                comment.total_vote_score,
                voteType,
                previousVoteType,
              ),
            }
          : comment;
      });
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
      setUserHistory?.(previousState);
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

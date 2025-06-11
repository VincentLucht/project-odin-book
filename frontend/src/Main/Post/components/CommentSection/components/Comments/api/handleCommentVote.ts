import commentVote from '@/Main/Post/components/CommentSection/components/Comments/api/commentVote';
import deleteCommentVote from '@/Main/Post/components/CommentSection/components/Comments/api/deleteCommentVote';
import getNewScore from '@/util/getNewScore';
import catchError from '@/util/catchError';

import { VoteType } from '@/interface/backendTypes';
import { toast } from 'react-toastify';
import { DBCommentWithReplies } from '@/interface/dbSchema';

export default async function handleCommentVote(
  comment_id: string,
  userId: string | undefined,
  voteType: VoteType,
  token: string | null,
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>,
  previousVoteType: VoteType | undefined,
) {
  if (!token || !userId) {
    toast.error('You need to log in to vote');
    return;
  }

  const updateCommentState = () => {
    setComments((prev) => {
      if (!prev) return prev;
      previousState = [...prev];

      const updateComment = (comment: DBCommentWithReplies): DBCommentWithReplies => {
        // Comment found
        if (comment.id === comment_id) {
          return {
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
          };
        }

        // If not target comment, check replies recursively
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map(updateComment),
          };
        }

        // No match
        return comment;
      };

      return prev.map(updateComment);
    });
  };

  let previousState: DBCommentWithReplies[] | null = null;

  // Optimistic update
  updateCommentState();

  try {
    if (voteType === previousVoteType) {
      await deleteCommentVote(comment_id, token);
    } else {
      await commentVote(comment_id, voteType, token);
    }
  } catch (error) {
    if (previousState) {
      setComments(previousState);
    }
    const errorObj = error as { message?: string };

    if (
      errorObj.message === 'You already voted for this comment' ||
      errorObj.message === 'Comment not found'
    ) {
      updateCommentState();
    } else {
      catchError(error);
    }
  }
}

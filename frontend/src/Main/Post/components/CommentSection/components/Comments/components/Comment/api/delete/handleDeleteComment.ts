import { DBCommentWithReplies } from '@/interface/dbSchema';
import deleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/deleteComment';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';

export default function handleDeleteComment(
  token: string,
  commentId: string,
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>,
) {
  const toastId = toast.loading('Deleting comment...');

  deleteComment(token, commentId)
    .then(() => {
      let previousState: DBCommentWithReplies[] | undefined = undefined;

      try {
        const deleteCommentInTree = (
          comment: DBCommentWithReplies,
        ): DBCommentWithReplies => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_deleted: true,
              content: '',
              user_id: undefined,
              user: null,
              upvote_count: 0,
              downvote_count: 0,
              total_vote_score: 0,
            };
          }

          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => deleteCommentInTree(reply)),
            };
          }

          return comment;
        };

        setComments((prev) => {
          if (!prev) return prev;
          previousState = JSON.parse(JSON.stringify(prev)) as DBCommentWithReplies[];

          return prev.map((comment) => deleteCommentInTree(comment));
        });

        toastUpdate(toastId, 'success', 'Successfully deleted comment');
      } catch (error) {
        if (previousState) {
          setComments(previousState);
        }

        toastUpdate(toastId, 'error', 'Failed to delete comment');
        catchError(error);
      }
    })
    .catch((error) => {
      toastUpdate('Failed to delete comment', 'error', 'Failed to delete comment');
      catchError(error);
    });
}

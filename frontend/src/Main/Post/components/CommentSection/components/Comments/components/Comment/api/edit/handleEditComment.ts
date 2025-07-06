import { DBCommentWithReplies } from '@/interface/dbSchema';
import editComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/edit/editComment';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';

export default function handleEditComment(
  token: string,
  commentId: string,
  newContent: string,
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>,
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>,
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const toastId = toast.loading('Editing comment...');

  editComment(token, commentId, newContent)
    .then((response) => {
      const { updatedComment } = response;
      let previousState: DBCommentWithReplies[] | undefined = undefined;

      try {
        const updateCommentInTree = (
          comment: DBCommentWithReplies,
        ): DBCommentWithReplies => {
          if (comment.id === commentId) {
            return { ...updatedComment, replies: comment.replies };
          }

          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map((reply) => updateCommentInTree(reply)),
            };
          }

          return comment;
        };

        setComments((prev) => {
          if (!prev) return prev;
          previousState = JSON.parse(JSON.stringify(prev)) as DBCommentWithReplies[];

          return prev.map((comment) => updateCommentInTree(comment));
        });

        setIsEditActive(false);
        toastUpdate(toastId, 'success', 'Successfully edited comment');
        setSubmitting(false);
      } catch (error) {
        if (previousState) {
          setComments(previousState);
        }

        catchError(error);
        toastUpdate(toastId, 'error', 'Failed to edit comment');
        setSubmitting(false);
      }
    })
    .catch((error) => {
      catchError(error);
      toastUpdate(toastId, 'error', 'Failed to edit comment');
      setSubmitting(false);
    });
}

import { DBCommentWithReplies } from '@/interface/dbSchema';
import deleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/deleteComment';
import catchError from '@/util/catchError';

export default function handleDeleteComment(
  token: string,
  commentId: string,
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>,
) {
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
      } catch (error) {
        if (previousState) {
          setComments(previousState);
        }

        catchError(error);
      }
    })
    .catch((error) => {
      catchError(error);
    });
}

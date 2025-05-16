import deleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/deleteComment';
import catchError from '@/util/catchError';
import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { toast } from 'react-toastify';
import isPost from '@/Main/user/UserProfile/util/isPost';

export default function handleDeleteCommentOverview(
  token: string | undefined,
  commentId: string,
  setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>,
) {
  if (!token) {
    toast.error('This is not your comment');
    return;
  }

  deleteComment(token, commentId)
    .then(() => {
      let previousState = null;

      try {
        setUserHistory((prev) => {
          if (!prev) return prev;
          previousState = [...prev];

          return prev.filter((value) => {
            if (!isPost(value) && value.id === commentId) {
              return false;
            }

            return true;
          });
        });
      } catch (error) {
        if (previousState) {
          setUserHistory(previousState);
        }

        catchError(error);
      }
    })
    .catch((error) => {
      catchError(error);
    });
}

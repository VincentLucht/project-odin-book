import deleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/deleteComment';
import catchError from '@/util/catchError';
import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { toast } from 'react-toastify';
import isPost from '@/Main/user/UserProfile/util/isPost';

export default function handleDeleteCommentOverview(
  token: string | undefined,
  commentId: string,
  setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>,
) {
  if (!token) {
    toast.error('This is not your comment');
    return;
  }

  deleteComment(token, commentId)
    .then(() => {
      let previousState: UserAndHistory | null = null;

      try {
        setFetchedUser((prev) => {
          if (!prev) return prev;
          previousState = { ...prev };

          const updatedHistory =
            Array.isArray(prev.history) && prev.history.length > 0
              ? prev.history.filter((value) => {
                  if (!isPost(value) && value.id === commentId) {
                    return false;
                  }

                  return true;
                })
              : prev.history;

          return { ...prev, history: updatedHistory };
        });
      } catch (error) {
        if (previousState) {
          setFetchedUser(previousState);
        }

        catchError(error);
      }
    })
    .catch((error) => {
      catchError(error);
    });
}

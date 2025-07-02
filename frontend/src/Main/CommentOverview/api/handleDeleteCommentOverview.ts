import deleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/deleteComment';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import isPost from '@/Main/user/UserProfile/util/isPost';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { SavedComment } from '@/interface/dbSchema';

export default function handleDeleteCommentOverview(
  token: string | undefined,
  commentId: string,
  setUserHistory?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>,
  setSavedComments?: React.Dispatch<React.SetStateAction<SavedComment[]>>,
) {
  if (!token) {
    toast.error('This is not your comment');
    return;
  }

  deleteComment(token, commentId)
    .then(() => {
      let previousUserHistoryState = null;
      let previousSavedCommentsState = null;

      try {
        setUserHistory?.((prev) => {
          if (!prev) return prev;
          previousUserHistoryState = [...prev];

          return prev.filter((value) => {
            if (!isPost(value) && value.id === commentId) {
              return false;
            }
            return true;
          });
        });

        setSavedComments?.((prev) => {
          if (!prev) return prev;
          previousSavedCommentsState = [...prev];

          return prev.filter((comment) => comment.id !== commentId);
        });
      } catch (error) {
        if (previousUserHistoryState) {
          setUserHistory?.(previousUserHistoryState);
        }
        if (previousSavedCommentsState) {
          setSavedComments?.(previousSavedCommentsState);
        }
        catchError(error);
      }
    })
    .catch((error) => {
      catchError(error);
    });
}

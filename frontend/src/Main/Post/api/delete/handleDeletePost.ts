import deletePost from '@/Main/Post/api/delete/deletePost';
import catchError from '@/util/catchError';
import toastUpdate from '@/util/toastUpdate';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { Id } from 'react-toastify';

export default function handleDeletePost(
  postId: string,
  token: string,
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
  toastId: Id,
) {
  deletePost(postId, token)
    .then(() => {
      setPost((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          deleted_at: new Date(),
          poster_id: null,
          poster: null,
          title: '',
          body: '',
          pinned_at: null,
        };
      });

      toastUpdate(toastId, 'success', 'Successfully deleted post');
    })
    .catch((error) => {
      catchError(error);
      toastUpdate(toastId, 'success', 'Failed to delete post');
    });
}

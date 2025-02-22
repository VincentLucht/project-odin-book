import deletePost from '@/Main/Post/api/delete/deletePost';
import catchError from '@/util/catchError';
import { DBPostWithCommunity } from '@/interface/dbSchema';

export default function handleDeletePost(
  postId: string,
  token: string,
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
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
    })
    .catch((error) => {
      catchError(error);
    });
}

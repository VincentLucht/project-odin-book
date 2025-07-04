import editPost from '@/Main/Post/api/edit/editPost';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { DBPostWithCommunity } from '@/interface/dbSchema';

export default function handleEditPost(
  token: string,
  postId: string,
  newBody: string,
  isSpoiler: boolean,
  isMature: boolean,
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>,
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
) {
  const toastId = toast.loading('Editing post...');

  editPost(postId, newBody, isSpoiler, isMature, token)
    .then(() => {
      setPost((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          edited_at: new Date(),
          body: newBody,
          is_spoiler: isSpoiler,
          is_mature: isMature,
        };
      });

      toastUpdate(toastId, 'success', 'Successfully edited post');
      setIsEditActive(false);
    })
    .catch((error) => {
      toastUpdate(toastId, 'error', 'Failed edited post');
      catchError(error);
    });
}

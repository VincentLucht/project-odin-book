import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import deletePostFlair from '@/Main/Post/components/PostFlairTag/api/deletePostFlair';

import { DBPostWithCommunity } from '@/interface/dbSchema';

export default function handleDeletePostFlair(
  postId: string,
  flairId: string,
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
  token: string | null,
) {
  if (!token) return;

  const toastId = toast.loading('Assigning post flair...');

  deletePostFlair(postId, flairId, token)
    .then((response) => {
      toastUpdate(toastId, 'success', response.message);

      setPost((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          post_assigned_flair: [],
        };
      });
    })
    .catch((error: { message: string }) => {
      toastUpdate(toastId, 'error', error.message);
    });
}

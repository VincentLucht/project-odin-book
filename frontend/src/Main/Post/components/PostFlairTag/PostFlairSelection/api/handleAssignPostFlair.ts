import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import assignPostFlair from '@/Main/Post/components/PostFlairTag/api/assignPostFlair';

import { DBPostWithCommunity } from '@/interface/dbSchema';

export default function handleAssignPostFlair(
  postId: string,
  flairId: string,
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
  token: string | null,
) {
  if (!token) return;

  const toastId = toast.loading('Assigning post flair...');

  assignPostFlair(postId, flairId, token)
    .then((response) => {
      toastUpdate(toastId, 'success', response.message);

      const { newFlair } = response;
      setPost((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          post_assigned_flair: [
            { id: newFlair.id, community_flair: newFlair.community_flair },
          ],
        };
      });
    })
    .catch((error: { message: string }) => {
      toastUpdate(toastId, 'error', error.message);
    });
}

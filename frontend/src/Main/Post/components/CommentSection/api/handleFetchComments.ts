import { DBCommentWithReplies } from '@/interface/dbSchema';
import fetchComments from '@/Main/Post/components/CommentSection/api/fetchComments';
import catchError from '@/util/catchError';

export default function handleFetchComments(
  post_id: string,
  token: string | null,
  setterFunc: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>,
  onComplete: () => void,
) {
  fetchComments(post_id, token)
    .then((response) => {
      setterFunc(response.comments);
      onComplete();
    })
    .catch((error) => {
      catchError(error);
      onComplete();
    });
}

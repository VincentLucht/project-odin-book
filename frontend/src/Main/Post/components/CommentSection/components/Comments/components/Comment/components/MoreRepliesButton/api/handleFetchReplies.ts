import fetchReplies from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/MoreRepliesButton/api/fetchReplies';
import catchError from '@/util/catchError';
import { DBCommentWithReplies } from '@/interface/dbSchema';

export default function handleFetchReplies(
  token: string | null,
  post_id: string,
  parent_comment_id: string,
  setterFunc: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>,
  onComplete: () => void,
) {
  fetchReplies(token, post_id, parent_comment_id)
    .then((response) => {
      setterFunc(response.comments);
      onComplete();
    })
    .catch((error) => {
      catchError(error);
      onComplete();
    });
}

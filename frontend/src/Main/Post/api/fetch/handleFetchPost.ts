import { DBPostWithCommunity } from '@/interface/dbSchema';
import fetchPost from '@/Main/Post/api/fetch/fetchPost';
import catchError from '@/util/catchError';

export default function handleFetchPost(
  post_id: string,
  token: string | null,
  setterFunc: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
) {
  fetchPost(post_id, token)
    .then((response) => {
      setterFunc(response.postAndCommunity);
    })
    .catch((error) => {
      catchError(error);
    });
}

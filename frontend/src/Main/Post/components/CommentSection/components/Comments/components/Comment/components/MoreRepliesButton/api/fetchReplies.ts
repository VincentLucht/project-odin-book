import API_URL from '@/auth/ApiUrl';
import { DBCommentWithReplies } from '@/interface/dbSchema';

interface FetchRepliesResponse {
  message: string;
  error?: string;
  comments: DBCommentWithReplies[];
}

export default async function fetchReplies(
  token: string | null,
  post_id: string,
  parent_comment_id: string,
) {
  const response = await fetch(
    `${API_URL}/comment/${post_id}/replies/${parent_comment_id}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: token ?? '',
      },
    },
  );

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchRepliesResponse;
  return result;
}

import API_URL from '@/auth/ApiUrl';
import { DBCommentWithReplies } from '@/interface/dbSchema';

interface FetchCommentsResponse {
  message: string;
  error?: string;
  comments: DBCommentWithReplies[];
}

export default async function fetchComments(post_id: string, token: string | null) {
  const response = await fetch(`${API_URL}/comment/${post_id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: token ?? '',
    },
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchCommentsResponse;
  return result;
}

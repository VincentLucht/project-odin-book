import API_URL from '@/auth/ApiUrl';
import { DBComment } from '@/interface/dbSchema';

interface CommentResponse {
  message: string;
  error?: string;
  comment: DBComment;
}

export default async function comment(
  text: string,
  post_id: string,
  parent_comment_id: string | undefined,
  token: string,
) {
  const response = await fetch(`${API_URL}/comment`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      content: text,
      post_id,
      parent_comment_id,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const comment = (await response.json()) as CommentResponse;
  return comment;
}

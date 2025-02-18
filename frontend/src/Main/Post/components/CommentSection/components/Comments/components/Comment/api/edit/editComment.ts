import API_URL from '@/auth/ApiUrl';
import { DBCommentWithReplies } from '@/interface/dbSchema';

interface EditCommentResponse {
  message: string;
  error?: string;
  updatedComment: DBCommentWithReplies;
}

export default async function editComment(
  token: string,
  comment_id: string,
  new_content: string,
) {
  const response = await fetch(`${API_URL}/comment`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({ comment_id, new_content }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as EditCommentResponse;
  return result;
}

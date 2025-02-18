import API_URL from '@/auth/ApiUrl';

interface DeleteCommentResponse {
  message: string;
  error?: string;
}

export default async function deleteComment(token: string, comment_id: string) {
  const response = await fetch(`${API_URL}/comment`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({ comment_id }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as DeleteCommentResponse;
  return result;
}

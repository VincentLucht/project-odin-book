import API_URL from '@/auth/ApiUrl';

interface DeleteCommentVoteResponse {
  message: string;
  error?: string;
}

export default async function deleteCommentVote(comment_id: string, token: string) {
  const response = await fetch(`${API_URL}/comment/vote`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      comment_id,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as DeleteCommentVoteResponse;
  return result;
}

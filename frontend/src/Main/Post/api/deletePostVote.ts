import API_URL from '@/auth/ApiUrl';

interface VoteDeletionResponse {
  message: string;
}

export default async function deletePostVote(post_id: string, token: string) {
  const response = await fetch(`${API_URL}/community/post/vote`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({ post_id, token }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  return (await response.json()) as VoteDeletionResponse;
}

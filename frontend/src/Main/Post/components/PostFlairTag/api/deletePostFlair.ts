import API_URL from '@/auth/ApiUrl';

interface DeletePostFlairResponse {
  message: string;
  error?: string;
}

export default async function deletePostFlair(
  post_id: string,
  community_flair_id: string,
  token: string,
) {
  const response = await fetch(`${API_URL}/community/post/flair`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({ post_id, community_flair_id }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as DeletePostFlairResponse;
  return result;
}

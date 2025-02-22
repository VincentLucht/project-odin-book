import API_URL from '@/auth/ApiUrl';

interface DeletePostResponse {
  message: string;
  error?: string;
}

export default async function deletePost(post_id: string, token: string) {
  const response = await fetch(`${API_URL}/post`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({ post_id }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as DeletePostResponse;
  return result;
}

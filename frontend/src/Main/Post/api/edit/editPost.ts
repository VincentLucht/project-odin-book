import API_URL from '@/auth/ApiUrl';
import { PostAssignedFlair } from '@/interface/dbSchema';

interface EditPostResponse {
  message: string;
  error?: string;
  newFlair: PostAssignedFlair;
}

export default async function editPost(
  post_id: string,
  body: string,
  is_spoiler: boolean,
  is_mature: boolean,
  token: string,
) {
  const response = await fetch(`${API_URL}/post`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      post_id,
      body,
      is_spoiler,
      is_mature,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as EditPostResponse;
  return result;
}

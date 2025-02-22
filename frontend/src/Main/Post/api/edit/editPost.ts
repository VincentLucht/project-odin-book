import API_URL from '@/auth/ApiUrl';
import { DBPostAssignedFlairWithCommunityFlair } from '@/interface/dbSchema';

interface EditPostResponse {
  message: string;
  error?: string;
  newFlair: DBPostAssignedFlairWithCommunityFlair;
}

export default async function editPost(
  post_id: string,
  body: string,
  is_spoiler: boolean,
  is_mature: boolean,
  flair_id: string | null,
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
      flair_id,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as EditPostResponse;
  return result;
}

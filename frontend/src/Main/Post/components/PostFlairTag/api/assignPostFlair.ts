import API_URL from '@/auth/ApiUrl';
import { DBCommunityFlair } from '@/interface/dbSchema';

interface AssignPostFlairResponse {
  message: string;
  error?: string;
  newFlair: {
    id: string;
    community_flair_id: string;
    post_id: string;
    community_flair: DBCommunityFlair;
  };
}

export default async function assignPostFlair(
  post_id: string,
  community_flair_id: string,
  token: string,
) {
  const response = await fetch(`${API_URL}/community/post/flair`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      post_id,
      community_flair_id,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as AssignPostFlairResponse;
  return result;
}

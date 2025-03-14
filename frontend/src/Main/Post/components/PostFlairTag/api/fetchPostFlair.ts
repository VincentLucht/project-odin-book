import API_URL from '@/auth/ApiUrl';
import { CommunityFlair } from '@/interface/dbSchema';

interface FetchPostFlairResponse {
  message: string;
  error?: string;
  allPostFlairs: CommunityFlair[];
}

export default async function fetchPostFlair(communityId: string, token: string) {
  const response = await fetch(
    `${API_URL}/community/flair/post?community_id=${communityId}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: token,
      },
    },
  );

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchPostFlairResponse;
  return result;
}

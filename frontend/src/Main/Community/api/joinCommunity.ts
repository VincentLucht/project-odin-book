import API_URL from '@/auth/ApiUrl';

interface JoinCommunityResponse {
  message: string;
  error?: string;
}

export default async function joinCommunity(community_id: string, token: string) {
  const response = await fetch(`${API_URL}/community/join`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({ community_id }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as JoinCommunityResponse;
  return result;
}

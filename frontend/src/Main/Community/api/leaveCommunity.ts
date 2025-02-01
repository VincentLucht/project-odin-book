import API_URL from '@/auth/ApiUrl';

interface LeaveCommunityResponse {
  message: string;
  error?: string;
}

export default async function leaveCommunity(community_id: string, token: string) {
  const response = await fetch(`${API_URL}/community/leave`, {
    method: 'DELETE',
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

  const result = (await response.json()) as LeaveCommunityResponse;
  return result;
}

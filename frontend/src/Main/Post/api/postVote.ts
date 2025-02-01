import API_URL from '@/auth/ApiUrl';
import { VoteType } from '@/interface/backendTypes';

interface VoteResponse {
  message: string;
}

export default async function postVote(
  post_id: string,
  vote_type: VoteType,
  token: string,
) {
  const response = await fetch(`${API_URL}/community/post/vote`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({ post_id, vote_type, token }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  return (await response.json()) as VoteResponse;
}

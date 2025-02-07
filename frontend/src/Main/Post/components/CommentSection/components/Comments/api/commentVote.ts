import API_URL from '@/auth/ApiUrl';
import { VoteType } from '@/interface/backendTypes';

interface CommentVoteResponse {
  message: string;
  error?: string;
}

export default async function commentVote(
  comment_id: string,
  vote_type: VoteType,
  token: string,
) {
  const response = await fetch(`${API_URL}/comment/vote`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      comment_id,
      vote_type,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as CommentVoteResponse;
  return result;
}

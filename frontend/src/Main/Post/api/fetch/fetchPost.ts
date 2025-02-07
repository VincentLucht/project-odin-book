import API_URL from '@/auth/ApiUrl';
import { DBPostWithCommunity } from '@/interface/dbSchema';

interface FetchPostResponse {
  message: string;
  error?: string;
  postAndCommunity: DBPostWithCommunity;
}

export default async function fetchPost(post_id: string, token: string | null) {
  const response = await fetch(`${API_URL}/post/${post_id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: token ?? '',
    },
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchPostResponse;
  return result;
}

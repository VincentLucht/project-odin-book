import API_URL from '@/auth/ApiUrl';
import { DBMainTopic } from '@/interface/dbSchema';

interface GetAllTopicsResponse {
  message: string;
  error?: string;
  topics: DBMainTopic[];
}

export default async function getAllTopics() {
  const response = await fetch(`${API_URL}/topic`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as GetAllTopicsResponse;
  return result;
}

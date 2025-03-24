import API_URL from '@/auth/ApiUrl';
import { DBCommunity } from '@/interface/dbSchema';
import { TimeFrame } from '@/Main/Community/Community';

interface SearchCommunitiesByRelevanceResponse {
  message: string;
  error?: string;
  communities: DBCommunity[];
}

export default async function searchCommunities(
  query: string,
  timeframe: TimeFrame,
  safeSearch: boolean,
) {
  const response = await fetch(
    `${API_URL}/search/communities?q=${encodeURIComponent(query)}&t=${timeframe}&safeSearch=${safeSearch}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as SearchCommunitiesByRelevanceResponse;
  return result;
}

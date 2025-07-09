import API_URL from '@/auth/ApiUrl';
import { RecentCommunity } from '@/Sidebar/components/RecentCommunities/context/RecentCommunitiesProvider';

interface FetchRecentCommunitiesResponse {
  message: string;
  error?: string;
  recentCommunities: RecentCommunity[];
}

export default async function fetchRecentCommunities(token: string) {
  const response = await fetch(`${API_URL}/user/recent-communities`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchRecentCommunitiesResponse;
  return result;
}

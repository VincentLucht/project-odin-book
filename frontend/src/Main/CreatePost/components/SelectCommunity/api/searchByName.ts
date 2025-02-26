import API_URL from '@/auth/ApiUrl';
import { CommunityTypes } from '@/interface/dbSchema';

interface SearchByNameResponse {
  message: string;
  error?: string;
  communities: CommunitySearch[];
}

export interface CommunitySearch {
  id: string;
  name: string;
  profile_picture_url: string | null;
  total_members: number;
  type: CommunityTypes;
}

export default async function searchByName(
  community_name: string,
  token: string,
  getMembership = false,
) {
  const response = await fetch(
    `${API_URL}/community/${encodeURIComponent(community_name)}/search?get_membership=${getMembership}`,
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

  const result = (await response.json()) as SearchByNameResponse;
  return result;
}

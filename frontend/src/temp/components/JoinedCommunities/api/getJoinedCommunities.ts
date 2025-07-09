import API_URL from '@/auth/ApiUrl';

interface CommunitySmall {
  id: string;
  name: string;
  profile_picture_url: string | null;
}

export interface JoinedCommunity {
  community: CommunitySmall;
}

interface GetJoinedCommunitiesResponse {
  message: string;
  error?: string;
  joinedCommunities: JoinedCommunity[];
  hasMore: boolean;
}

export default async function getJoinedCommunities(
  token: string,
  page: number,
  limit?: number,
) {
  const response = await fetch(
    `${API_URL}/community/joined-communities?page=${page}${limit && `&limit=${limit}`}`,
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

  const result = (await response.json()) as GetJoinedCommunitiesResponse;
  return result;
}

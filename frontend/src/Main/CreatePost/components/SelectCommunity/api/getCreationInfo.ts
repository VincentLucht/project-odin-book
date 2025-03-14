import API_URL from '@/auth/ApiUrl';
import { CommunityTypes } from '@/interface/dbSchema';
import { UserRoles } from '@/interface/dbSchema';

interface GetCreationInfoResponse {
  message: string;
  error?: string;
  community: CreationInfo;
}

export interface CreationInfo {
  id: string;
  name: string;
  profile_picture_url: string | null;
  type: CommunityTypes;
  allow_basic_user_posts: boolean;
  is_post_flair_required: boolean;
  user_communities: { id: string; role: UserRoles; user_id: string }[];
}

export default async function getCreationInfo(
  communityName: string,
  token: string,
  getMembership = false,
) {
  const response = await fetch(
    `${API_URL}/community/${communityName}/creation-info?get_membership=${getMembership}`,
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

  const result = (await response.json()) as GetCreationInfoResponse;
  return result;
}

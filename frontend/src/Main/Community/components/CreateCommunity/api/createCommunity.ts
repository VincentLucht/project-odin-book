import API_URL from '@/auth/ApiUrl';
import { CommunityTypes } from '@/interface/dbSchema';

interface CreateCommunityResponse {
  message: string;
  error?: string;
}

export default async function createCommunity(
  name: string,
  description: string,
  is_mature: boolean,
  allow_basic_user_posts: boolean,
  is_post_flair_required: boolean,
  type: CommunityTypes,
  topics: string[],
  banner_url_desktop: string | null,
  banner_url_mobile: string | null,
  profile_picture_url: string | null,
  token: string,
) {
  const response = await fetch(`${API_URL}/community`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify({
      name,
      description,
      is_mature,
      allow_basic_user_posts,
      is_post_flair_required,
      type,
      topics,
      banner_url_desktop,
      banner_url_mobile,
      profile_picture_url,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as CreateCommunityResponse;
  return result;
}

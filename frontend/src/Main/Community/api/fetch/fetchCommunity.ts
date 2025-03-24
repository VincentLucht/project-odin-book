import API_URL from '@/auth/ApiUrl';
import { CommunityTypes, DBCommunityRule, UserRoles } from '@/interface/dbSchema';
import { SortByType } from '@/Main/Community/Community';
import { DBPostWithCommunityName, UserAssignedFlair } from '@/interface/dbSchema';

export type FetchedCommunity = Omit<FetchedCommunityWithPosts, 'posts'>;

export interface FetchedCommunityWithPosts {
  id: string;
  description: string;
  allow_basic_user_posts: boolean;
  banner_url_desktop: string | null;
  banner_url_mobile: string | null;
  created_at: Date;
  is_mature: boolean;
  is_post_flair_required: boolean;
  name: string;
  owner_id: string;
  profile_picture_url: string | null;
  total_members: number;
  type: CommunityTypes;

  posts: DBPostWithCommunityName[];
  user_communities: { user_id: string; role: UserRoles }[] | undefined;
  community_moderators: { user: CommunityModerator }[];
  community_rules: DBCommunityRule[];
}

export interface CommunityModerator {
  id: string;
  profile_picture_url: string;
  username: string;
  user_assigned_flair: UserAssignedFlair;
}

interface FetchCommunityResponse {
  message: string;
  error?: string;
  community: FetchedCommunityWithPosts;
  hasMore: boolean;
}

export default async function fetchCommunity(
  communityName: string,
  sortByType: SortByType,
  timeframe: string | null,
  token: string | null,
) {
  const response = await fetch(
    `${API_URL}/r/${communityName}/${sortByType}/${timeframe}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: token ?? '',
      },
    },
  );

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchCommunityResponse;
  return result;
}

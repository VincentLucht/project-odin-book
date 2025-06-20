import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhasesOptional } from '@/interface/misc';
import { CommunityTypes, DBCommunity } from '@/interface/dbSchema';
import { CommunityModerator } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { Pagination } from '@/interface/backendTypes';

const endpoint = '/community/mod';

export interface CommunityModeration extends DBCommunity {
  owner: {
    deleted_at: null;
    description: string;
    display_name: string;
    id: string;
    is_mature: boolean;
    profile_picture_url: string;
    username: string;
  };
  community_moderators: { is_active: boolean; user: CommunityModerator }[];
}

export async function getModInfo(
  token: string | null,
  apiData: { community_name: string },
) {
  try {
    const response = await apiRequest<{
      message: string;
      community: CommunityModeration;
    }>(`${`${endpoint}?community_name=${apiData.community_name}`}`, 'GET', token);

    return response.community;
  } catch (error) {
    catchError(error);
    return false;
  }
}

export interface FetchedModerator {
  user: {
    username: string;
    profile_picture_url: string | null;
  };
  created_at: string;
}

export async function fetchModerators(
  community_id: string,
  cursorId: string,
  onComplete: (moderators: FetchedModerator[], pagination: Pagination) => void,
) {
  try {
    const response = await apiRequest<{
      message: string;
      moderators: FetchedModerator[];
      pagination: Pagination;
    }>(`${`${endpoint}/moderators?cmId=${community_id}&cId=${cursorId}`}`, 'GET', '');

    onComplete(response.moderators, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

export async function updateCommunitySettings(
  token: string | null,
  apiData: {
    community_name: string;
    description?: string;
    community_type?: CommunityTypes;
    is_mature?: boolean;
    allow_basic_user_posts?: boolean;
    is_post_flair_required?: boolean;
    profile_picture_url?: string;
    banner_url_desktop?: string;
    banner_url_mobile?: string;
  },
  messages?: APILoadingPhasesOptional,
) {
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(`${`${endpoint}/settings`}`, 'PUT', token, apiData);
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully updated');
    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to update');
    catchError(error);
    return false;
  }
}

import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhasesOptional } from '@/interface/misc';
import { CommunityTypes, DBCommunity, UserRoles } from '@/interface/dbSchema';
import { CommunityModerator } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { Pagination } from '@/interface/backendTypes';
import { MemberType } from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMembersApiFilters';

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

export interface FetchedCommunityMember {
  id: string;
  joined_at: string;
  role?: UserRoles;
  created_at?: string;
  banned_at?: string;
  ban_reason?: string;
  ban_duration?: string;
  approved_at?: string;
  is_moderator?: boolean;
  user: {
    username: string;
    profile_picture_url: string | undefined;
  };
}

export async function getMembers(
  token: string | null,
  communityId: string,
  cursorId: string | undefined,
  mode: MemberType,
  onComplete: (members: FetchedCommunityMember[], pagination: Pagination) => void,
) {
  try {
    const params = new URLSearchParams({
      cmId: communityId,
      cId: cursorId ?? '',
      m: mode,
    });

    const response = await apiRequest<{
      members: FetchedCommunityMember[];
      pagination: Pagination;
    }>(`/community/members?${params.toString()}`, 'GET', token);

    onComplete(response.members, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

export async function getMembersByName(
  token: string | null,
  communityId: string,
  username: string,
  mode: MemberType | 'all',
  onComplete: (members: FetchedCommunityMember[]) => void,
  take?: number,
) {
  try {
    const params = new URLSearchParams({
      cmId: communityId,
      u: username,
      m: mode,
      t: String(take),
    });

    const response = await apiRequest<{
      members: FetchedCommunityMember[];
    }>(`/community/members/search?${params.toString()}`, 'GET', token);

    onComplete(response.members);
  } catch (error) {
    catchError(error);
  }
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
    await apiRequest(`${endpoint}/settings`, 'PUT', token, apiData);
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully updated');
    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to update');
    catchError(error);
    return false;
  }
}

export async function makeMod(
  token: string,
  apiData: { community_id: string; username: string },
  onComplete: () => void,
) {
  try {
    await apiRequest(`${endpoint}/user`, 'POST', token, apiData);
    onComplete();
  } catch (error) {
    catchError(error);
  }
}

export async function removeMod(
  token: string,
  apiData: { community_id: string; username: string },
  onComplete: () => void,
) {
  try {
    await apiRequest(`${endpoint}/user`, 'DELETE', token, apiData);
    onComplete();
  } catch (error) {
    catchError(error);
  }
}

export async function leaveMod(
  token: string,
  apiData: { community_id: string },
  onComplete: () => void,
) {
  try {
    await apiRequest(`${endpoint}/user/leave`, 'DELETE', token, apiData);
    onComplete();
  } catch (error) {
    catchError(error);
  }
}

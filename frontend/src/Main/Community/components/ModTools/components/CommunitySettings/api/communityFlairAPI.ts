import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhasesOptional } from '@/interface/misc';
import { DBCommunityFlair } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

// ! GET
interface FetchedPostFlairsResponse {
  message: string;
  flairs: DBCommunityFlair[];
  pagination: Pagination;
  communityFlairCount?: number;
}
export async function fetchCommunityFlairs(
  token: string | null,
  apiData: {
    community_name: string;
    cursor_id: string | null;
    type: 'post' | 'user';
    getFlairCount?: boolean;
  },
  onComplete: (
    postFlairs: DBCommunityFlair[],
    pagination: Pagination,
    flairCount?: number,
  ) => void,
) {
  const endpoint = `/community/flair?cn=${apiData.community_name}&cId=${apiData.cursor_id}&initF=${apiData.getFlairCount}&t=${apiData.type}`;

  try {
    const result = await apiRequest<FetchedPostFlairsResponse>(endpoint, 'GET', token);
    onComplete(result.flairs, result.pagination, result?.communityFlairCount);
  } catch (error) {
    catchError(error);
  }
}

// ! CREATE
interface CommunityFlairCreationResponse {
  message: string;
  flair: DBCommunityFlair;
}
export async function createCommunityFlair(
  token: string | null,
  apiData: {
    community_id: string;
    name: string;
    textColor: string;
    color: string;
    is_assignable_to_posts: boolean;
    is_assignable_to_users: boolean;
    emoji: string | null;
  },
  messages?: APILoadingPhasesOptional,
) {
  const endpoint = '/community/flair';
  const toastId = toast.loading(messages?.loading);

  try {
    const response = await apiRequest<CommunityFlairCreationResponse>(
      endpoint,
      'POST',
      token,
      apiData,
    );
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully created');
    return response.flair;
  } catch (error) {
    catchError(error);
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to create');
    return false;
  }
}

// ! UPDATE
export async function updateCommunityFlair(
  token: string | null,
  apiData: {
    community_flair_id: string;
    community_id: string;
    name: string;
    textColor: string;
    color: string;
    is_assignable_to_posts: boolean;
    is_assignable_to_users: boolean;
    emoji: string | null;
  },
  messages?: APILoadingPhasesOptional,
) {
  const endpoint = '/community/flair';
  const toastId = toast.loading(messages?.loading);

  try {
    const response = await apiRequest<CommunityFlairCreationResponse>(
      endpoint,
      'PUT',
      token,
      apiData,
    );
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully created');
    return response.flair;
  } catch (error) {
    catchError(error);
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to create');
    return false;
  }
}

// ! DELETE
export async function deleteCommunityFlair(
  token: string | null,
  apiData: { community_id: string; community_flair_id: string },
  messages?: APILoadingPhasesOptional,
) {
  const endpoint = '/community/flair';
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(endpoint, 'DELETE', token, apiData);
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully deleted');
    return true;
  } catch (error) {
    catchError(error);
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to delete');
    return false;
  }
}

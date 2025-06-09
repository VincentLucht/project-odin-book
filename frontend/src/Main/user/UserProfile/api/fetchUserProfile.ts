import API_URL from '@/auth/ApiUrl';
import {
  DBCommentWithCommunityName,
  DBPostWithCommunityName,
} from '@/interface/dbSchema';
import { UserProfilePagination } from '@/Main/user/UserProfile/UserProfile';
import { UserHistoryUser } from '@/Main/user/UserProfile/UserProfile';

export type UserHistoryItem =
  | (DBPostWithCommunityName & { item_type: 'post'; removed_by_moderation: boolean })
  | (DBCommentWithCommunityName & {
      item_type: 'comment';
      removed_by_moderation: boolean;
    });

interface FetchUserProfileResponse {
  message: string;
  error?: string;
  user: UserHistoryUser;
  history: UserHistoryItem[];
  pagination: UserProfilePagination;
}

export default async function fetchUserProfile(
  token: string | null,
  apiData: {
    username: string;
    sort_by_type: 'new' | 'top';
  },
  apiFilters: {
    typeFilter: 'both' | 'posts' | 'comments';
    initialFetch: boolean;
  },
  pagination: UserProfilePagination,
) {
  const { username, sort_by_type } = apiData;
  const { typeFilter, initialFetch } = apiFilters;
  const { lastId, lastDate, lastScore } = pagination.nextCursor;

  const params = new URLSearchParams({
    u: username,
    sbt: sort_by_type,
    cId: lastId,
    cLs: lastScore !== null ? lastScore.toString() : '',
    cLd: lastDate ?? '',
    tf: typeFilter,
    initF: initialFetch.toString(),
  });

  const response = await fetch(`${API_URL}/user?${params.toString()}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: token ?? '',
    },
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchUserProfileResponse;
  return result;
}

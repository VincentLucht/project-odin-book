import API_URL from '@/auth/ApiUrl';
import { SortBy } from '@/interface/backendTypes';
import {
  DBCommentWithCommunityName,
  DBPostWithCommunityName,
  DBUser,
} from '@/interface/dbSchema';

export interface UserAndHistory extends DBUser {
  history: (DBPostWithCommunityName | DBCommentWithCommunityName)[];
}

interface FetchUserProfileResponse {
  message: 'string';
  error?: 'string';
  user: UserAndHistory;
}

export default async function fetchUserProfile(
  username: string,
  page: number,
  sortBy: SortBy,
) {
  const response = await fetch(
    `${API_URL}/user/?username=${encodeURIComponent(username)}&sort_by=${encodeURIComponent(sortBy)}&page=${encodeURIComponent(page)}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchUserProfileResponse;
  return result;
}

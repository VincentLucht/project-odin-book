import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';

import { Pagination } from '@/interface/backendTypes';
import { TimeFrame } from '@/Main/Community/Community';
import { HomepagePost } from '@/Main/Pages/Homepage/Homepage';

// All calls are in userCommunityController.ts

// ! GET
interface fetchHomePageResponse {
  message: string;
  posts: HomepagePost[];
  pagination: Pagination;
}
export async function fetchHomePage(
  token: string | null,
  apiData: {
    sortBy: 'new' | 'top';
    timeframe: TimeFrame;
    cursorId: string | undefined;
  },
  onComplete: (posts: HomepagePost[], pagination: Pagination) => void,
) {
  const endpoint = `/community/homepage?sbt=${apiData.sortBy}&t=${apiData.timeframe}&cId=${apiData.cursorId}`;

  try {
    const result = await apiRequest<fetchHomePageResponse>(endpoint, 'GET', token);
    onComplete(result.posts, result.pagination);
  } catch (error) {
    catchError(error);
  }
}

export async function banUser(
  token: string,
  apiData: {
    community_id: string;
    username: string;
    ban_duration: string | null;
    ban_reason: string;
  },
  onComplete: () => void,
) {
  try {
    await apiRequest('/community/members/ban', 'POST', token, apiData);
    onComplete();
  } catch (error) {
    catchError(error);
  }
}

export async function unbanUser(
  token: string,
  apiData: {
    community_id: string;
    username: string;
  },
  onComplete: () => void,
) {
  try {
    await apiRequest('/community/members/unban', 'DELETE', token, apiData);
    onComplete();
  } catch (error) {
    catchError(error);
  }
}

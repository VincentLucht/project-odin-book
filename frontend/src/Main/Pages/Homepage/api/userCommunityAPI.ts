import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';

import { Pagination } from '@/interface/backendTypes';
import { TimeFrame } from '@/Main/Community/Community';
import { HomepagePost } from '@/Main/Pages/Homepage/Homepage';

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

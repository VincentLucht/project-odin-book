import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { Pagination } from '@/interface/backendTypes';
import { HomepagePost } from '@/Main/Pages/Homepage/Homepage';
import { TimeFrame } from '@/Main/Community/Community';

// All calls are in postController.ts
const endpoint = '/post/popular';

interface FetchReportsResponse {
  message: string;
  posts: HomepagePost[];
  pagination: Pagination;
}
export async function fetchPopularPosts(
  token: string | null,
  apiData: {
    sortByType: 'new' | 'top';
    timeframe: TimeFrame;
    cursorId: string | undefined;
  },
  onComplete: (reports: HomepagePost[], pagination: Pagination) => void,
) {
  try {
    const { sortByType, cursorId } = apiData;

    const params = new URLSearchParams({
      sbt: sortByType,
      cId: cursorId ?? '',
    });

    const response = await apiRequest<FetchReportsResponse>(
      `${endpoint}?${params.toString()}`,
      'GET',
      token,
    );

    onComplete(response.posts, response.pagination);

    return response;
  } catch (error) {
    catchError(error);
    return false;
  }
}

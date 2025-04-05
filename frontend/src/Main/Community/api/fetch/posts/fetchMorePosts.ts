import API_URL from '@/auth/ApiUrl';
import { FetchedPost, SortByType, TimeFrame } from '@/Main/Community/Community';
import { Pagination } from '@/interface/backendTypes';

interface FetchMorePostsResponse {
  message: string;
  error?: string;
  posts: FetchedPost[];
  pagination: Pagination;
}

export default async function fetchMorePosts(
  community_id: string,
  sort_by_type: SortByType,
  timeframe: TimeFrame,
  token: string | null,
  cursorId: string | undefined,
) {
  const response = await fetch(
    `${API_URL}/post?cyId=${community_id}&sbt=${sort_by_type}&cId=${cursorId}&t=${timeframe}`,
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

  const result = (await response.json()) as FetchMorePostsResponse;
  return result;
}

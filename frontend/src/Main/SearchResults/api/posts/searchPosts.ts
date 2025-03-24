import API_URL from '@/auth/ApiUrl';
import { TimeFrame } from '@/Main/Community/Community';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBPostSearch } from '@/Main/SearchResults/SearchResults';

interface SearchPostsResponse {
  message: string;
  error?: string;
  posts: DBPostSearch[];
  nextCursor: string;
}

export default async function searchPosts(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  timeframe?: TimeFrame,
  cursorId?: string,
) {
  const response = await fetch(
    `${API_URL}/search/posts?q=${encodeURIComponent(query)}&sbt=${sortByType}&t=${timeframe}&cId=${cursorId}&safeSearch=${safeSearch}`,
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

  const result = (await response.json()) as SearchPostsResponse;
  return result;
}

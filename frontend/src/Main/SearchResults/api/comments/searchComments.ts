import API_URL from '@/auth/ApiUrl';
import { TimeFrame } from '@/Main/Community/Community';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBCommentSearch } from '@/Main/SearchResults/components/DisplaySearchResults/components/CommentOverviewSearch';

interface SearchCommentsResponse {
  message: string;
  error?: string;
  comments: DBCommentSearch[];
}

export default async function searchComments(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  timeframe?: TimeFrame,
  cursorId?: string,
) {
  const response = await fetch(
    `${API_URL}/search/comments?q=${encodeURIComponent(query)}&sbt=${sortByType}&t=${timeframe}&cId=${cursorId}&safeSearch=${safeSearch}`,
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

  const result = (await response.json()) as SearchCommentsResponse;
  return result;
}

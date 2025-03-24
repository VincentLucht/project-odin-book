import searchPosts from '@/Main/SearchResults/api/posts/searchPosts';
import catchError from '@/util/catchError';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { TimeFrame } from '@/Main/Community/Community';
import { DBPostSearch } from '@/Main/SearchResults/SearchResults';

export default function handleSearchPosts(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  setPosts: (posts: DBPostSearch[]) => void,
  onComplete?: (nextCursor: string | null) => void,
  timeframe?: TimeFrame,
  cursorId?: string,
) {
  searchPosts(query, sortByType, safeSearch, timeframe, cursorId)
    .then((response) => {
      setPosts(response.posts);
      onComplete && onComplete(response.nextCursor || null);
    })
    .catch((error) => {
      catchError(error);
      onComplete && onComplete(null);
    });
}

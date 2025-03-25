import searchComments from '@/Main/SearchResults/api/comments/searchComments';
import catchError from '@/util/catchError';
import { TimeFrame } from '@/Main/Community/Community';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBCommentSearch } from '@/Main/SearchResults/components/DisplaySearchResults/components/CommentOverviewSearch';

export default function handleSearchComments(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  setComments: (comments: DBCommentSearch[]) => void,
  onComplete?: (nextCursor: string | null) => void,
  timeframe?: TimeFrame,
  cursorId?: string,
) {
  searchComments(query, sortByType, safeSearch, timeframe, cursorId)
    .then((response) => {
      setComments(response.comments);
      onComplete && onComplete(response.nextCursor || null);
    })
    .catch((error) => {
      catchError(error);
      onComplete && onComplete(null);
    });
}

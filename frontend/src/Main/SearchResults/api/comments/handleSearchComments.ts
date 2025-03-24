import searchComments from '@/Main/SearchResults/api/comments/searchComments';
import catchError from '@/util/catchError';
import { TimeFrame } from '@/Main/Community/Community';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBCommentSearch } from '@/Main/SearchResults/components/DisplaySearchResults/components/CommentOverviewSearch';

export default function handleSearchComments(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  setComments: React.Dispatch<React.SetStateAction<DBCommentSearch[]>>,
  timeframe?: TimeFrame,
  cursorId?: string,
) {
  searchComments(query, sortByType, safeSearch, timeframe, cursorId)
    .then((response) => {
      setComments(response.comments);
    })
    .catch((error) => {
      catchError(error);
    });
}

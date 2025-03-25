import searchUsers from '@/Main/SearchResults/api/users/searchUsers';
import catchError from '@/util/catchError';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBUser } from '@/interface/dbSchema';

export default function handleSearchUsers(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  setUsers: (users: DBUser[]) => void,
  onComplete?: (nextCursor: string | null) => void,
  cursorId?: string,
) {
  searchUsers(query, sortByType, safeSearch, cursorId)
    .then((response) => {
      setUsers(response.users);
      onComplete && onComplete(response.nextCursor || null);
    })
    .catch((error) => {
      catchError(error);
      onComplete && onComplete(null);
    });
}

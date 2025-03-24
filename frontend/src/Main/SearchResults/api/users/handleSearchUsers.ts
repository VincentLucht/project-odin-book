import searchUsers from '@/Main/SearchResults/api/users/searchUsers';
import catchError from '@/util/catchError';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBUser } from '@/interface/dbSchema';

export default function handleSearchUsers(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  setUsers: React.Dispatch<React.SetStateAction<DBUser[]>>,
  offset?: number,
) {
  searchUsers(query, sortByType, safeSearch, offset)
    .then((response) => {
      setUsers(response.users);
    })
    .catch((error) => {
      catchError(error);
    });
}

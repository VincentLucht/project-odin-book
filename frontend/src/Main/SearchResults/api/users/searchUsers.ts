import API_URL from '@/auth/ApiUrl';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBUser } from '@/interface/dbSchema';

interface SearchUsersResponse {
  message: string;
  error?: string;
  users: DBUser[];
  nextCursor: string;
}

export default async function searchUsers(
  query: string,
  sortByType: SortByTypeSearch,
  safeSearch: boolean,
  cursorId?: string,
) {
  const response = await fetch(
    `${API_URL}/search/users?q=${encodeURIComponent(query)}&sbt=${sortByType}&safeSearch=${safeSearch}&cId=${cursorId}`,
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

  const result = (await response.json()) as SearchUsersResponse;
  return result;
}

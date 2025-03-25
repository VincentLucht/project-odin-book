import searchCommunities from '@/Main/SearchResults/api/communities/searchCommunities';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import { TimeFrame } from '@/Main/Community/Community';
import { DBCommunity } from '@/interface/dbSchema';

export default function handleSearchCommunities(
  query: string,
  timeframe: TimeFrame,
  safeSearch: boolean,
  setCommunities: (communities: DBCommunity[]) => void,
  onComplete?: (nextCursor: string | null) => void,
  cursorId?: string,
) {
  if (!query) {
    toast.error('Community Name is required');
    return;
  }

  searchCommunities(query, timeframe, safeSearch, cursorId)
    .then((response) => {
      setCommunities(response.communities);
      onComplete && onComplete(response.nextCursor || null);
    })
    .catch((error) => {
      catchError(error);
      onComplete && onComplete(null);
    });
}

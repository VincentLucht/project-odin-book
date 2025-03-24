import searchCommunities from '@/Main/SearchResults/api/communities/searchCommunities';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import { TimeFrame } from '@/Main/Community/Community';
import { DBCommunity } from '@/interface/dbSchema';

export default function handleSearchCommunities(
  query: string,
  timeframe: TimeFrame,
  safeSearch: boolean,
  setCommunities: React.Dispatch<React.SetStateAction<DBCommunity[]>>,
) {
  if (!query) {
    toast.error('Community Name is required');
    return;
  }

  searchCommunities(query, timeframe, safeSearch)
    .then((response) => {
      setCommunities(response.communities);
    })
    .catch((error) => {
      catchError(error);
    });
}

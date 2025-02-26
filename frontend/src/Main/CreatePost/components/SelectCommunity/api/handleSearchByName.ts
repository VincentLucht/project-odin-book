import searchByName, {
  CommunitySearch,
} from '@/Main/CreatePost/components/SelectCommunity/api/searchByName';
import catchError from '@/util/catchError';

export default function handleSearchByName(
  community_name: string,
  token: string,
  setFoundCommunities: React.Dispatch<React.SetStateAction<CommunitySearch[]>>,
  getMembership = false,
) {
  searchByName(community_name, token, getMembership)
    .then((response) => {
      setFoundCommunities(response.communities);
    })
    .catch((error) => {
      catchError(error);
    });
}

import getCreationInfo, {
  CreationInfo,
} from '@/Main/CreatePost/components/SelectCommunity/api/getCreationInfo';
import catchError from '@/util/catchError';

export default function handleGetCreationInfo(
  communityName: string,
  token: string,
  getMembership = false,
  setActiveCommunity: React.Dispatch<React.SetStateAction<CreationInfo | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setIsLoading(true);

  getCreationInfo(communityName, token, getMembership)
    .then((response) => {
      setActiveCommunity(response.community);
      setIsLoading(false);
    })
    .catch((error) => {
      catchError(error);
      setIsLoading(false);
    });
}

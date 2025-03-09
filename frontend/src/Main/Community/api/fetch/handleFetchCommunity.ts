import fetchCommunity from '@/Main/Community/api/fetch/fetchCommunity';
import catchError from '@/util/catchError';

import { SortByType } from '@/Main/Community/Community';
import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

export default function handleFetchCommunity(
  communityName: string,
  sortByType: SortByType,
  timeframe: string | null,
  token: string | null,
  setCommunity: React.Dispatch<React.SetStateAction<FetchedCommunity | null>>,
  setPosts: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>,
) {
  fetchCommunity(communityName, sortByType, timeframe, token)
    .then((response) => {
      const { posts, ...communityWithoutPosts } = response.community;
      setCommunity(communityWithoutPosts);
      setPosts(posts);
    })
    .catch((error) => {
      catchError(error);
    });
}

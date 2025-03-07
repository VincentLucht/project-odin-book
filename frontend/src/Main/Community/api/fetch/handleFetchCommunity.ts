import fetchCommunity from '@/Main/Community/api/fetch/fetchCommunity';
import catchError from '@/util/catchError';

import { SortByType } from '@/Main/Community/Community';
import {
  FetchedCommunity,
  FetchedPost,
} from '@/Main/Community/api/fetch/fetchCommunity';

export default function handleFetchCommunity(
  communityName: string,
  sortByType: SortByType,
  timeframe: string | null,
  token: string | null,
  setCommunity: React.Dispatch<React.SetStateAction<FetchedCommunity | null>>,
  setPosts: React.Dispatch<React.SetStateAction<FetchedPost[]>>,
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

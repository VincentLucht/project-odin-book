import fetchCommunityWithPosts from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import catchError from '@/util/catchError';

import { SortByType } from '@/Main/Community/Community';
import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { FetchedPost } from '@/Main/Community/Community';

export default function handleFetchCommunity(
  communityName: string,
  sortByType: SortByType,
  timeframe: string | null,
  token: string | null,
  setCommunity: React.Dispatch<React.SetStateAction<FetchedCommunity | null>>,
  onComplete?: (
    posts?: FetchedPost[],
    cursorId?: string,
    hasMore?: boolean,
    isRefetch?: boolean,
  ) => void,
) {
  fetchCommunityWithPosts(communityName, sortByType, timeframe, token)
    .then((response) => {
      const { posts, ...communityWithoutPosts } = response.community;
      setCommunity(communityWithoutPosts);

      const { nextCursor, hasMore } = response.pagination;
      onComplete && onComplete(posts, nextCursor, hasMore, true);
    })
    .catch((error) => {
      catchError(error);
      onComplete && onComplete();
    });
}

import fetchMorePosts from '@/Main/Community/api/fetch/posts/fetchMorePosts';
import catchError from '@/util/catchError';
import { SortByType, TimeFrame } from '@/Main/Community/Community';
import { FetchedPost } from '@/Main/Community/Community';

export default function handleFetchMorePosts(
  community_id: string,
  sort_by_type: SortByType,
  timeframe: TimeFrame,
  token: string | null,
  cursorId: string | undefined,
  onComplete?: (posts?: FetchedPost[], cursorId?: string, hasMore?: boolean) => void,
) {
  fetchMorePosts(community_id, sort_by_type, timeframe, token, cursorId)
    .then((response) => {
      const { posts } = response;
      const { nextCursor, hasMore } = response.pagination;
      onComplete && onComplete(posts, nextCursor, hasMore);
    })
    .catch((error) => {
      catchError(error);
      onComplete && onComplete();
    });
}

import fetchComments from '@/Main/Post/components/CommentSection/api/fetchComments';
import catchError from '@/util/catchError';

import { CommentSortBy } from '@/Main/Post/components/CommentSection/CommentSection';
import { OnCompleteCommentSection } from '@/Main/Post/components/CommentSection/CommentSection';
import { TimeFrame } from '@/Main/Community/Community';

export default function handleFetchComments(
  post_id: string,
  token: string | null,
  sort_by_type: CommentSortBy,
  cursorId: string,
  timeframe: TimeFrame,
  isRefetch: boolean,
  onComplete?: OnCompleteCommentSection,
) {
  fetchComments(post_id, sort_by_type, cursorId, timeframe, token)
    .then((response) => {
      const { comments } = response;
      const { hasMore, nextCursor } = response.pagination;
      onComplete && onComplete(comments, nextCursor, hasMore, isRefetch);
    })
    .catch((error) => {
      catchError(error);
      onComplete && onComplete();
    });
}

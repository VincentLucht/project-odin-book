import API_URL from '@/auth/ApiUrl';
import { Pagination } from '@/interface/backendTypes';
import { DBCommentWithReplies } from '@/interface/dbSchema';
import { TimeFrame } from '@/Main/Community/Community';
import { CommentSortBy } from '@/Main/Post/components/CommentSection/CommentSection';

interface FetchCommentsResponse {
  message: string;
  error?: string;
  comments: DBCommentWithReplies[];
  pagination: Pagination;
}

export default async function fetchComments(
  post_id: string,
  sort_by_type: CommentSortBy,
  cursorId: string,
  timeframe: TimeFrame,
  token: string | null,
) {
  const response = await fetch(
    `${API_URL}/comment?pId=${post_id}&sbt=${sort_by_type}&t=${timeframe}&cId=${cursorId}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: token ?? '',
      },
    },
  );

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as FetchCommentsResponse;
  return result;
}

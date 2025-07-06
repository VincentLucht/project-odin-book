import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';

import { DBPostWithCommunity, SavedComment } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

export async function fetchSavedPosts(
  token: string,
  cursor_id: string | undefined,
  onComplete: (posts: DBPostWithCommunity[], pagination: Pagination) => void,
) {
  try {
    const params = new URLSearchParams({
      cId: cursor_id ?? '',
    });

    const response = await apiRequest<{
      posts: DBPostWithCommunity[];
      pagination: Pagination;
    }>(`/saved/posts?${params.toString()}`, 'GET', token);

    onComplete(response.posts, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

export async function fetchSavedComments(
  token: string,
  cursor_id: string | undefined,
  onComplete: (comments: SavedComment[], pagination: Pagination) => void,
) {
  try {
    const params = new URLSearchParams({
      cId: cursor_id ?? '',
    });

    const response = await apiRequest<{
      comments: SavedComment[];
      pagination: Pagination;
    }>(`/saved/comments?${params.toString()}`, 'GET', token);

    onComplete(response.comments, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

export async function manageSavedComments(
  token: string,
  comment_id: string,
  action: 'save' | 'unsave',
  onComplete: () => void,
) {
  const toastId = toast.loading(
    action === 'save' ? 'Saving comment...' : 'Removing comment from saved...',
  );
  try {
    const method = action === 'save' ? 'POST' : 'DELETE';
    await apiRequest('/comment/save', method, token, { comment_id });
    const successMessage =
      action === 'save'
        ? 'Successfully saved comment'
        : 'Successfully removed comment from saved';

    toastUpdate(toastId, 'success', successMessage);
    onComplete();
  } catch (error) {
    const errorMessage =
      action === 'save' ? 'Failed to save comment' : 'Failed to remove comment';
    toastUpdate(toastId, 'error', errorMessage);
    catchError(error);
  }
}

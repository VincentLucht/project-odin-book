import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhases } from '@/interface/misc';

const endpoint = '/community/mod/post';

export async function moderatePost(
  token: string | null,
  apiData: {
    post_id: string;
    reason?: string;
    moderation_action: 'APPROVED' | 'REMOVED';
  },
  messages?: APILoadingPhases,
) {
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(endpoint, 'POST', token, { ...apiData });
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully moderated post');
    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to moderated post');
    catchError(error);
    return false;
  }
}

export async function updatePostAsModerator(
  token: string | null,
  apiData: {
    post_id: string;
    is_mature?: boolean;
    is_spoiler?: boolean;
    lock_comments?: boolean;
  },
  messages?: APILoadingPhases,
) {
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(endpoint, 'PUT', token, { ...apiData });
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully updated post');
    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to update post');
    catchError(error);
    return false;
  }
}

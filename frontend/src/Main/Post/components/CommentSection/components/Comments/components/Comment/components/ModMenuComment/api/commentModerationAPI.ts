import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';

const endpoint = '/community/mod/comment';

export async function moderateComment(
  token: string | null,
  apiData: {
    comment_id: string;
    reason?: string;
    moderation_action: 'APPROVED' | 'REMOVED';
  },
  messages?: {
    loading?: string;
    success?: string;
    error?: string;
  },
) {
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(endpoint, 'POST', token, { ...apiData });
    toastUpdate(
      toastId,
      'success',
      messages?.success ?? 'Successfully moderated comment',
    );
    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to moderated comment');
    catchError(error);
    return false;
  }
}

import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';

// All calls are in approvedUserController.ts
const endpoint = '/community/user/approved';

export async function approveUser(
  token: string,
  community_id: string,
  approved_username: string,
  onComplete: () => void,
) {
  try {
    await apiRequest(endpoint, 'POST', token, {
      community_id,
      approved_username,
    });

    onComplete();
  } catch (error) {
    catchError(error);
  }
}

export async function unapproveUser(
  token: string,
  community_id: string,
  approved_username: string,
  onComplete: () => void,
) {
  try {
    await apiRequest(endpoint, 'DELETE', token, {
      community_id,
      approved_username,
    });
    onComplete();
  } catch (error) {
    catchError(error);
  }
}

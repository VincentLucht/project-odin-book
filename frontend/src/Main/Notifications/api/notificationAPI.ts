import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhasesOptional } from '@/interface/misc';
import { Pagination } from '@/interface/backendTypes';
import { DBNotification } from '@/interface/dbSchema';

// All calls are in notificationController.ts
const endpoint = '/notification';

export async function hasUnreadNotifications(token: string | null) {
  try {
    const response = await apiRequest<{ hasUnreadNotifications: boolean }>(
      `${endpoint}/unread-status`,
      'GET',
      token,
    );

    return response.hasUnreadNotifications;
  } catch (error) {
    catchError(error);
    return false;
  }
}

interface FetchByNotificationResponse {
  notifications: DBNotification[];
  pagination: Pagination;
}
export async function fetchByNotification(
  token: string | null,
  apiData: {
    cursor_id: string;
    sort_by_type: 'all' | 'read' | 'unread';
    include_hidden: boolean;
  },
  onComplete: (notifications: DBNotification[], pagination: Pagination) => void,
) {
  try {
    const { cursor_id, sort_by_type, include_hidden } = apiData;
    const params = new URLSearchParams({
      cId: cursor_id ?? '',
      sbt: sort_by_type,
      iH: include_hidden.toString(),
    });

    const response = await apiRequest<FetchByNotificationResponse>(
      `${endpoint}?${params.toString()}`,
      'GET',
      token,
    );

    onComplete(response.notifications, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

export async function readAllNotifications(
  token: string | null,
  messages?: APILoadingPhasesOptional,
) {
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(`${`${endpoint}/read-all`}`, 'PUT', token);
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully read');

    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to read');

    catchError(error);
    return false;
  }
}

export async function openAllNotifications(token: string | null) {
  try {
    await apiRequest(`${`${endpoint}/open`}`, 'PUT', token);
  } catch (error) {
    catchError(error);
  }
}

export async function readNotification(
  token: string | null,
  apiData: { notification_id: string },
  onComplete: () => void,
) {
  try {
    await apiRequest(`${`${endpoint}/read`}`, 'PUT', token, apiData);
    onComplete();
  } catch (error) {
    catchError(error);
  }
}

export async function hideNotification(
  token: string | null,
  apiData: { notification_id: string },
) {
  const toastId = toast.loading('Hiding notification...');

  try {
    await apiRequest(`${`${endpoint}/hide`}`, 'PUT', token, apiData);
    toastUpdate(toastId, 'success', 'Successfully hid notification');

    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', 'Failed to hide notification');

    catchError(error);
    return false;
  }
}

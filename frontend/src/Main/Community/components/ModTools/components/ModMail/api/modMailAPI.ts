import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhases } from '@/interface/misc';
import { Pagination } from '@/interface/backendTypes';
import { FetchedModMail } from '@/Main/Community/components/ModTools/components/ModMail/components/ModMailMessage';

// All calls are in modMailController.ts
const endpoint = '/modmail';

export async function fetchModMail(
  token: string | null,
  apiData: { community_name: string; cursor_id: string },
  apiFilters: {
    onlyArchived: boolean;
    getArchived: boolean;
    getReplied: boolean;
  },
  onComplete: (modmail: FetchedModMail[], pagination: Pagination) => void,
) {
  try {
    const { community_name, cursor_id } = apiData;
    const { onlyArchived, getArchived, getReplied } = apiFilters;

    const params = new URLSearchParams({
      cn: community_name,
      oA: onlyArchived.toString(),
      gA: getArchived.toString(),
      gR: getReplied.toString(),
      cId: cursor_id ?? '',
    });

    const response = await apiRequest<{
      message: string;
      modmail: FetchedModMail[];
      pagination: Pagination;
    }>(`/modmail?${params.toString()}`, 'GET', token);

    onComplete(response.modmail, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

export async function sendMessage(
  token: string | null,
  apiData: { community_id: string; subject: string; message: string },
  messages?: APILoadingPhases,
) {
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(`${`${endpoint}`}`, 'POST', token, apiData);
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully created');
    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to create');
    catchError(error);
    return false;
  }
}

export async function replyToMessage(
  token: string | null,
  apiData: {
    subject: string;
    message: string;
    modmail_id: string;
  },
  messages?: APILoadingPhases,
) {
  const toastId = toast.loading(messages?.loading);

  try {
    await apiRequest(`${`${endpoint}/reply`}`, 'POST', token, apiData);
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully created');
    return true;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to create');
    catchError(error);
    return false;
  }
}

export async function updateMessage(
  token: string | null,
  apiData: Partial<{
    modmail_id: string;
    archived?: boolean;
    replied?: boolean;
  }>,
) {
  try {
    await apiRequest(`${`${endpoint}`}`, 'PUT', token, apiData);
    return true;
  } catch (error) {
    catchError(error);
    return false;
  }
}

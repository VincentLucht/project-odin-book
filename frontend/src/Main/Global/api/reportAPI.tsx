import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhases } from '@/interface/misc';
import { DBReport } from '@/interface/dbSchema';

// All calls are in reportController.ts
const endpoint = '/report';

export interface ReportResponse {
  message: string;
  report: DBReport;
}
export async function report(
  token: string | null,
  apiData: {
    type: 'POST' | 'COMMENT';
    item_id: string;
    subject: string;
    reason: string;
  },
  messages?: APILoadingPhases,
) {
  const toastId = toast.loading(messages?.loading);

  try {
    const response = await apiRequest<ReportResponse>(
      `${`${endpoint}`}`,
      'POST',
      token,
      apiData,
    );
    toastUpdate(toastId, 'success', messages?.success ?? 'Successfully created');
    return response.report;
  } catch (error) {
    toastUpdate(toastId, 'error', messages?.error ?? 'Failed to create');
    catchError(error);
    return false;
  }
}

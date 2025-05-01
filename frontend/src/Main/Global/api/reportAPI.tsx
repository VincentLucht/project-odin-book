import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { APILoadingPhases } from '@/interface/misc';
import { DBReport } from '@/interface/dbSchema';
import { FetchedReport } from '@/Main/Community/components/ModTools/components/ModQueue/ModQueue';

export interface PaginationReports {
  hasMore: boolean;
  nextCursor: {
    lastScore: string;
    lastDate: string;
    lastId: string;
  };
}

// All calls are in reportController.ts
const endpoint = '/report';

interface FetchReportsResponse {
  message: string;
  reports: FetchedReport[];
  pagination: PaginationReports;
}
export async function fetchReports(
  token: string | null,
  apiData: {
    community_name: string;
    type: 'all' | 'posts' | 'comments';
    status: 'pending' | 'moderated' | 'approved' | 'dismissed';
    sortByType: 'new' | 'top';
    lastScore: string;
    lastDate: string;
    lastId: string;
  },
  onComplete: (reports: FetchedReport[], pagination: PaginationReports) => void,
) {
  try {
    const { community_name, type, status, sortByType, lastScore, lastDate, lastId } =
      apiData;

    const params = new URLSearchParams({
      cn: community_name,
      t: type,
      s: status,
      sbt: sortByType,
      ls: lastScore,
      ld: lastDate,
      cId: lastId,
    });

    const response = await apiRequest<FetchReportsResponse>(
      `${endpoint}?${params.toString()}`,
      'GET',
      token,
    );

    onComplete(response.reports, response.pagination);

    return response;
  } catch (error) {
    catchError(error);
    return false;
  }
}

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

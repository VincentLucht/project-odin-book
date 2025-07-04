import { useCallback, useEffect, useState } from 'react';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import VirtualizedModQueue from '@/Main/Community/components/ModTools/components/ModQueue/components/VirtualizedModQueue';
import ModQueueApiFilters from '@/Main/Community/components/ModTools/components/ModQueue/components/components/ModQueueApiFilters';

import { fetchReports } from '@/Main/Global/api/reportAPI';

import { DBReport } from '@/interface/dbSchema';
import { PaginationReports } from '@/Main/Global/api/reportAPI';

export type ModQueueType = 'all' | 'posts' | 'comments';
export type ModQueueStatus = 'pending' | 'moderated' | 'approved' | 'dismissed';
export interface ModQueueApiFilterProps {
  type: ModQueueType;
  sortByType: 'new' | 'top';
  status: ModQueueStatus;
}

export interface FetchedReport extends DBReport {
  report_count: number;
  post: {
    id: string | number;
    title: string;
    body: string;
    total_vote_score: number;
    upvote_count: number;
    downvote_count: number;
    community_name: string;
  };
  comment: {
    id: string;
    content: string;
    total_vote_score: number;
    upvote_count: number;
    downvote_count: number;
    parent_post: {
      id: string;
      title: string;
      body: string;
      community_name: string;
    };
  };
  user: {
    username: string;
    profile_picture_url: string;
  };
  moderator: {
    username: string;
    profile_picture_url: string | null;
  };
}

export default function ModQueue() {
  const [loading, setLoading] = useState(true);
  const [apiFilters, setApiFilters] = useState<ModQueueApiFilterProps>({
    type: 'posts',
    sortByType: 'top',
    status: 'pending',
  });
  const [pagination, setPagination] = useState<PaginationReports>({
    hasMore: true,
    nextCursor: {
      lastScore: '',
      lastDate: '',
      lastId: '',
    },
  });
  const [reports, setReports] = useState<FetchedReport[]>([]);

  const { community } = useModToolsContext();
  const { user, token } = useAuthGuard();

  const loadMore = useCallback(
    (lastScore: string, lastDate: string, lastId: string, isInitialFetch = false) => {
      setLoading(true);

      void fetchReports(
        token,
        {
          community_name: community.name,
          type: apiFilters.type,
          status: apiFilters.status,
          sortByType: apiFilters.sortByType,
          lastScore,
          lastDate,
          lastId,
        },
        (reports, pagination) => {
          isInitialFetch
            ? setReports(reports)
            : setReports((prev) => [...prev, ...reports]);

          setPagination(pagination);
          setLoading(false);
        },
      );
    },
    [community.name, token, apiFilters],
  );

  useEffect(() => {
    setPagination((prev) => ({ ...prev, hasMore: true }));
    setReports([]);

    loadMore('', '', '', true);
  }, [loadMore, apiFilters]);

  if (!token || !user) return;

  return (
    <div className="p-4 center-main">
      <div className="w-full max-w-[1500px]">
        <h2 className="mb-4 text-3xl font-bold">Queue</h2>

        <ModQueueApiFilters apiFilters={apiFilters} setApiFilters={setApiFilters} />

        <VirtualizedModQueue
          token={token}
          user={user}
          reports={reports}
          setReports={setReports}
          pagination={pagination}
          loadMore={loadMore}
          loading={loading}
        />
      </div>
    </div>
  );
}

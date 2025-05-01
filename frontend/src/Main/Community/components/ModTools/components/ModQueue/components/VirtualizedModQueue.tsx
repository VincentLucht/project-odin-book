import { useState, useCallback } from 'react';

import { Virtuoso } from 'react-virtuoso';
import ModQueueReport from '@/Main/Community/components/ModTools/components/ModQueue/components/ModQueueReport';

import EndMessageHandler from '@/Main/Global/EndMessageHandler';

import { FetchedReport } from '@/Main/Community/components/ModTools/components/ModQueue/ModQueue';
import { PaginationReports } from '@/Main/Global/api/reportAPI';
import { TokenUser } from '@/context/auth/AuthProvider';

interface VirtualizedModQueueProps {
  token: string | null;
  user: TokenUser;
  reports: FetchedReport[];
  setReports: React.Dispatch<React.SetStateAction<FetchedReport[]>>;
  pagination: PaginationReports;
  loadMore: (
    lastScore: string,
    lastDate: string,
    lastId: string,
    isInitialFetch?: boolean,
  ) => void;
  loading: boolean;
}

export default function VirtualizedModQueue({
  token,
  user,
  reports,
  setReports,
  pagination,
  loadMore,
  loading,
}: VirtualizedModQueueProps) {
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [currentCommentId, setCurrentCommentId] = useState<string | null>(null);

  const ItemRenderer = useCallback(
    (index: number) => {
      const report = reports[index];
      if (!report) return null;

      return (
        <div data-id={report.id}>
          <ModQueueReport
            report={report}
            user={user}
            setReports={setReports}
            token={token}
            currentPostId={currentPostId}
            setCurrentPostId={setCurrentPostId}
            currentCommentId={currentCommentId}
            setCurrentCommentId={setCurrentCommentId}
          />
        </div>
      );
    },
    [reports, token, user, currentPostId, currentCommentId, setReports],
  );

  return (
    <div>
      <Virtuoso
        data={reports}
        itemContent={(index) => ItemRenderer(index)}
        overscan={200}
        useWindowScroll
        scrollerRef={() => window}
        computeItemKey={(index) => reports[index]?.id || index.toString()}
        endReached={() => {
          if (pagination.hasMore && !loading) {
            loadMore(
              pagination.nextCursor.lastScore,
              pagination.nextCursor.lastDate,
              pagination.nextCursor.lastId,
              false,
            );
          }
        }}
      />

      <EndMessageHandler
        loading={loading}
        hasMorePages={pagination.hasMore}
        dataLength={reports.length}
        noResultsMessage="No reports found."
      />
    </div>
  );
}

import { useCallback, useRef } from 'react';

import { Virtuoso } from 'react-virtuoso';
import ModMailMessage from '@/Main/Community/components/ModTools/components/ModMail/components/ModMailMessage';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';

import { FetchedModMail } from '@/Main/Community/components/ModTools/components/ModMail/components/ModMailMessage';
import { Pagination } from '@/interface/backendTypes';

interface VirtualizedModMailMessagesProps {
  token: string | null;
  modMail: FetchedModMail[];
  setModMail: React.Dispatch<React.SetStateAction<FetchedModMail[]>>;
  pagination: Pagination;
  loadMore: (cursorId: string, isInitialFetch?: boolean) => void;
  loading: boolean;
}

export default function VirtualizedModMailMessages({
  token,
  modMail,
  setModMail,
  pagination,
  loadMore,
  loading,
}: VirtualizedModMailMessagesProps) {
  const virtuosoRef = useRef(null);

  const ItemRenderer = useCallback(
    (index: number) => {
      const modmail = modMail[index];
      if (!modmail) return null;

      return (
        <div data-id={modmail.id}>
          <ModMailMessage
            token={token}
            modMail={modmail}
            key={modmail.id}
            setModMail={setModMail}
          />
        </div>
      );
    },
    [modMail, setModMail, token],
  );
  return (
    <div>
      <>
        <Virtuoso
          ref={virtuosoRef}
          data={modMail}
          totalCount={modMail.length}
          itemContent={(index) => ItemRenderer(index)}
          overscan={200}
          useWindowScroll
          scrollerRef={() => window}
          computeItemKey={(index) => modMail[index]?.id || index.toString()}
          endReached={() => {
            if (pagination.hasMore && !loading) {
              loadMore(pagination.nextCursor);
            }
          }}
        />

        {loading && <LogoLoading className="mt-8" />}
      </>
    </div>
  );
}

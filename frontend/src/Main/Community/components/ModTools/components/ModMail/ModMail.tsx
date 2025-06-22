import { useState, useEffect, useCallback } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import VirtualizedModMailMessages from '@/Main/Community/components/ModTools/components/ModMail/components/VirtualizedModMailMessages';
import ModMailApiFilters from '@/Main/Community/components/ModTools/components/ModMail/components/ModMailApiFilters';

import { fetchModMail } from '@/Main/Community/components/ModTools/components/ModMail/api/modMailAPI';

import { FetchedModMail } from '@/Main/Community/components/ModTools/components/ModMail/components/ModMailMessage';
import { Pagination } from '@/interface/backendTypes';

export default function ModMail() {
  const { community } = useModToolsContext();
  const [modMail, setModMail] = useState<FetchedModMail[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    nextCursor: '',
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [apiFilters, setApiFilters] = useState({
    onlyArchived: false,
    getArchived: false,
    getReplied: false,
  });

  const { token } = useAuthGuard();

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      setLoading(true);

      void fetchModMail(
        token,
        {
          community_name: community.name,
          cursor_id: cursorId,
        },
        apiFilters,
        (modmail, pagination) => {
          isInitialFetch
            ? setModMail(modmail)
            : setModMail((prev) => [...prev, ...modmail]);

          setPagination(pagination);
          setLoading(false);
        },
      );
    },
    [community.name, apiFilters, token],
  );

  useEffect(() => {
    loadMore('', true);
  }, [loadMore, apiFilters]);

  return (
    <div className="p-4 center-main">
      <div className="w-full max-w-[900px]">
        <h2 className="mb-4 text-3xl font-bold">Mod Mail</h2>

        <ModMailApiFilters apiFilters={apiFilters} setApiFilters={setApiFilters} />

        <VirtualizedModMailMessages
          token={token}
          modMail={modMail}
          setModMail={setModMail}
          pagination={pagination}
          loadMore={loadMore}
          loading={loading}
        />
      </div>
    </div>
  );
}

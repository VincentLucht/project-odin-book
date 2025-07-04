import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';

import SetSortByType from '@/Main/Community/components/CommunityHeader/components/SetSortByType';
import VirtualizedHomePage from '@/Main/Pages/Homepage/components/VirtualizedHomePage';

import { fetchPopularPosts } from '@/Main/Pages/Popular/api/popularAPI';

import { HomepagePost } from '@/Main/Pages/Homepage/Homepage';
import { Pagination } from '@/interface/backendTypes';
import { TimeFrame } from '@/Main/Community/Community';

export default function Popular() {
  const [posts, setPosts] = useState<HomepagePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: true,
    nextCursor: '',
  });
  const [apiParams, setApiParams] = useState<{
    sortByType: 'new' | 'top';
    timeframe: TimeFrame;
  }>({
    sortByType: 'top',
    timeframe: 'all',
  });

  const navigate = useNavigate();
  const { user, token } = useAuth();

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      setLoading(true);

      void fetchPopularPosts(
        token,
        {
          sortByType: apiParams.sortByType,
          timeframe: apiParams.timeframe,
          cursorId,
        },
        (posts, pagination) => {
          setPosts((prev) => (isInitialFetch ? [...posts] : [...posts, ...prev]));
          setPagination(pagination);
          setLoading(false);
        },
      );
    },
    [token, apiParams],
  );

  useEffect(() => {
    loadMore('', true);
  }, [loadMore, apiParams]);

  return (
    <div className="p-4 center-main">
      <div className="w-full max-w-[1072px]">
        <div className="relative">
          <SetSortByType
            sortByType={apiParams.sortByType}
            setSortByType={(sortBy) =>
              setApiParams((prev) => ({ ...prev, sortByType: sortBy as 'top' | 'new' }))
            }
            timeframe={apiParams.timeframe}
            setTimeframe={(timeframe) =>
              setApiParams((prev) => ({ ...prev, timeframe }))
            }
            excludeHot={true}
          />
        </div>

        <div className="relative lg:center-main-content">
          <VirtualizedHomePage
            posts={posts}
            setPosts={setPosts}
            userId={user?.id ?? ''}
            token={token}
            navigate={navigate}
            loading={loading}
            loadMore={loadMore}
            pagination={pagination}
            noResultsMessage="No posts found."
          />
        </div>
      </div>
    </div>
  );
}

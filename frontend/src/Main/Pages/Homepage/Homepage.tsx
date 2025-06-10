import { useState, useEffect, useCallback } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import { useNavigate } from 'react-router-dom';

import VirtualizedHomePage from '@/Main/Pages/Homepage/components/VirtualizedHomePage';
import SetSortByType from '@/Main/Community/components/CommunityHeader/components/SetSortByType';

import { fetchHomePage } from '@/Main/Pages/Homepage/api/userCommunityAPI';
import { Pagination } from '@/interface/backendTypes';
import { TimeFrame } from '@/Main/Community/Community';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

export interface HomePageApiParams {
  sortBy: 'new' | 'top';
  timeframe: TimeFrame;
}

export type HomepagePost = Omit<DBPostWithCommunityName, 'moderation'>;

export default function Homepage() {
  const [loading, setLoading] = useState(true);
  const [apiParams, setApiParams] = useState<HomePageApiParams>({
    sortBy: 'new',
    timeframe: 'week',
  });
  const [pagination, setPagination] = useState<Pagination>({
    hasMore: true,
    nextCursor: '',
  });

  const [posts, setPosts] = useState<HomepagePost[]>([]);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      setLoading(true);

      void fetchHomePage(
        token,
        {
          sortBy: apiParams.sortBy,
          timeframe: apiParams.timeframe,
          cursorId,
        },
        (posts, pagination) => {
          setPosts((prev) => (isInitialFetch ? [...posts] : [...prev, ...posts]));
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

  if (!token) {
    return (
      <div>
        You are not logged in. You can take a look at the{' '}
        <a onClick={() => navigate('/popular')}>Popular posts</a>
      </div>
    );
  }

  return (
    <div className="p-4 center-main">
      <div className="w-full max-w-[1072px]">
        <div className="relative">
          <SetSortByType
            sortByType={apiParams.sortBy}
            setSortByType={(sortBy) =>
              setApiParams((prev) => ({ ...prev, sortBy: sortBy as 'top' | 'new' }))
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
            userId={user.id}
            token={token}
            navigate={navigate}
            loading={loading}
            loadMore={loadMore}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}

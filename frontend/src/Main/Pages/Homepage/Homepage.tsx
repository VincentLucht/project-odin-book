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
  const [loadingState, setLoadingState] = useState({
    initial: true,
    fetchMore: false,
  });
  const [apiParams, setApiParams] = useState<HomePageApiParams>({
    sortBy: 'top',
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
    (isInitialFetch: boolean, cursorId: string) => {
      if (!isInitialFetch) {
        setLoadingState({ initial: false, fetchMore: true });
      }

      void fetchHomePage(
        token,
        {
          sortBy: apiParams.sortBy,
          timeframe: apiParams.timeframe,
          cursorId,
        },
        (posts, pagination) => {
          setPosts((prev) => (loadingState.initial ? [...posts] : [...posts, ...prev]));
          setPagination(pagination);
          setLoadingState({ initial: false, fetchMore: false });
        },
      );
    },
    [token, apiParams, loadingState.initial],
  );

  // Reset on API params changing
  useEffect(() => {
    if (!token) return;

    setPosts([]);
    loadMore(true, '');
  }, [token, loadMore, apiParams.sortBy, apiParams.timeframe]);

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
          />
        </div>

        <div className="relative center-main-content">
          <VirtualizedHomePage
            posts={posts}
            setPosts={setPosts}
            userId={user.id}
            token={token}
            navigate={navigate}
            loadingState={loadingState}
            loadMore={loadMore}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}

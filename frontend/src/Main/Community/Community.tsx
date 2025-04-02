import { useState, useEffect, useMemo } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import CommunityHeader from '@/Main/Community/components/CommunityHeader/CommunityHeader';
import SetSortByType from '@/Main/Community/components/CommunityHeader/components/SetSortByType';
import CommunitySidebar from '@/Main/Community/components/CommunitySidebar/CommunitySidebar';
import VirtualizedPostOverview from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';
import EndMessage from '@/components/partials/EndMessage';

import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';
import handleFetchCommunity from '@/Main/Community/api/fetch/handleFetchCommunity';
import getCommunityName from '@/Main/Community/util/getCommunityName';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

export type SortByType = 'hot' | 'new' | 'top';
export type TimeFrame = 'day' | 'week' | 'month' | 'year' | 'all';

// TODO: Add no posts
export default function Community() {
  const location = useLocation();
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);

  const [community, setCommunity] = useState<FetchedCommunity | null>(null);
  const [posts, setPosts] = useState<DBPostWithCommunityName[]>([]);

  const communityName = getCommunityName(location.pathname);
  const [sortByType, setSortByType] = useState<SortByType>('hot');
  const [timeframe, setTimeframe] = useState<TimeFrame>('day');

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const communityPostHandler = useMemo(
    () => new CommunityPostHandler(new CommunityPostManager(token), setPosts),
    [token],
  );

  useEffect(() => {
    handleFetchCommunity(
      communityName,
      sortByType,
      timeframe,
      token,
      setCommunity,
      setPosts,
    );
  }, [communityName, sortByType, timeframe, token]);

  if (!community) {
    return <div>No community found!</div>;
  }

  return (
    <div className="p-4 pt-1 center-main">
      <div className="w-full max-w-[1072px]">
        <CommunityHeader
          community={community}
          setCommunity={setCommunity}
          isMember={community?.user_communities?.[0]?.user_id === user?.id}
          user={user}
          token={token}
          navigate={navigate}
          pathname={location.pathname}
        />

        <div className="relative center-main-content">
          <div>
            <SetSortByType
              sortByType={sortByType}
              setSortByType={setSortByType}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
            />

            <VirtualizedPostOverview
              posts={posts}
              userId={user?.id}
              token={token}
              setPosts={setPosts}
              navigate={navigate}
              showEditDropdown={showEditDropdown}
              setShowEditDropdown={setShowEditDropdown}
              communityPostHandler={communityPostHandler}
              communityName={communityName}
            />

            <EndMessage />
          </div>

          <CommunitySidebar community={community} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

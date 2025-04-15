import { useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import useIsModerator from '@/hooks/useIsModerator';
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

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

export type SortByType = 'hot' | 'new' | 'top';
export type TimeFrame = 'day' | 'week' | 'month' | 'year' | 'all';

export type FetchedPost = Omit<DBPostWithCommunityName, 'community'>;

// TODO: Add no posts
export default function Community() {
  const location = useLocation();
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);
  const [showModDropdown, setShowModDropdown] = useState<string | null>(null);

  const [community, setCommunity] = useState<FetchedCommunity | null>(null);
  const [posts, setPosts] = useState<FetchedPost[]>([]);

  const communityName = getCommunityName(location.pathname);
  const [sortByType, setSortByType] = useState<SortByType>('new'); // ! TODO: Change back
  const [timeframe, setTimeframe] = useState<TimeFrame>('day');

  const [cursorId, setCursorId] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  const isMod = useIsModerator(user, community?.community_moderators);

  const communityPostHandler = useMemo(
    () =>
      new CommunityPostHandler<FetchedPost>(new CommunityPostManager(token), setPosts),
    [token],
  );

  const onComplete = useCallback(
    (
      posts?: FetchedPost[],
      cursorId?: string,
      hasMore?: boolean,
      isRefetch = false,
    ) => {
      if (posts) {
        if (isRefetch) {
          setPosts(posts);
        } else {
          setPosts((prev) => {
            if (!prev) return posts;
            return [...prev, ...posts];
          });
        }
      }

      if (cursorId !== undefined) setCursorId(cursorId);
      if (hasMore !== undefined) setHasMore(hasMore);
      setLoading(false);
      setLoadingMore(false);
    },
    [],
  );

  useEffect(() => {
    setCursorId('');
    setHasMore(true);

    handleFetchCommunity(
      communityName,
      sortByType,
      timeframe,
      token,
      setCommunity,
      onComplete,
    );
  }, [communityName, sortByType, timeframe, token, onComplete]);

  if (!community || loading) {
    return <div>No community found!</div>;
  }

  return (
    <div className="p-4 pt-1 center-main">
      <div className="w-full max-w-[1072px]">
        <CommunityHeader
          community={community}
          setCommunity={setCommunity}
          isMember={community?.user_communities?.[0]?.user_id === user?.id}
          isMod={isMod}
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
              community={{
                id: community.id,
                name: community.name,
                profile_picture_url: community.profile_picture_url,
                user_communities: community.user_communities,
              }}
              posts={posts}
              sortByType={sortByType}
              timeframe={timeframe}
              cursorId={cursorId}
              hasMore={hasMore}
              loadingMore={loadingMore}
              setLoadingMore={setLoadingMore}
              onComplete={onComplete}
              userId={user?.id}
              token={token}
              setPosts={setPosts}
              navigate={navigate}
              showEditDropdown={showEditDropdown}
              setShowEditDropdown={setShowEditDropdown}
              communityPostHandler={communityPostHandler}
              communityName={communityName}
              isMod={isMod}
              showModDropdown={showModDropdown}
              setShowModDropdown={setShowModDropdown}
            />

            {!hasMore && <EndMessage className="mt-5" />}
          </div>

          <CommunitySidebar community={community} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

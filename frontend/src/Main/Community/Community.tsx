import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import useIsModerator from '@/hooks/useIsModerator';
import useIsMember from '@/hooks/useIsMember';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import { useUpdateRecentCommunities } from '@/Sidebar/components/RecentCommunities/context/useUpdateRecentCommunities';

import CommunityHeader from '@/Main/Community/components/CommunityHeader/CommunityHeader';
import SetSortByType from '@/Main/Community/components/CommunityHeader/components/SetSortByType';
import CommunitySidebar from '@/Main/Community/components/CommunitySidebar/CommunitySidebar';
import VirtualizedPostOverview from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';
import ShowHideButton from '@/Main/Global/ShowHideButton';
import CommunityLazy from '@/Main/Community/loading/CommunityLazy';

import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';
import handleFetchCommunity from '@/Main/Community/api/fetch/handleFetchCommunity';
import getCommunityName from '@/Main/Community/util/getCommunityName';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

export type SortByType = 'hot' | 'new' | 'top';
export type TimeFrame = 'day' | 'week' | 'month' | 'year' | 'all';

export type FetchedPost = Omit<DBPostWithCommunityName, 'community'>;

export default function Community() {
  const location = useLocation();
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);
  const [showModDropdown, setShowModDropdown] = useState<string | null>(null);

  const [community, setCommunity] = useState<FetchedCommunity | null>(null);
  const [posts, setPosts] = useState<FetchedPost[]>([]);

  const communityName = getCommunityName(location.pathname);
  const previousCommunityName = useRef(communityName);
  const [sortByType, setSortByType] = useState<SortByType>('new');
  const [timeframe, setTimeframe] = useState<TimeFrame>('day');

  const [cursorId, setCursorId] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { isMobile } = useGetScreenSize();

  const { resetInitialFetch } = useUpdateRecentCommunities(community, user);

  const isMod = useIsModerator(user, community?.is_moderator);
  const isMember = useIsMember(user, community);

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
    setPosts([]);
    setLoadingMore(true);

    if (previousCommunityName.current !== communityName) {
      setCommunity(null);
      resetInitialFetch();
    }

    handleFetchCommunity(
      communityName,
      sortByType,
      timeframe,
      token,
      setCommunity,
      onComplete,
    );
  }, [communityName, sortByType, timeframe, token, onComplete, resetInitialFetch]);

  if (loading || !community) {
    return <CommunityLazy isMobile={isMobile} />;
  }

  if (!community && !loading) {
    return (
      <div>
        <div>No community with this name found.</div>

        <div>Are you sure this is the correct name? </div>
      </div>
    );
  }

  return (
    <div className="p-4 pt-1 center-main">
      <div className="w-full max-w-[1072px]">
        <CommunityHeader
          community={community}
          setCommunity={setCommunity}
          isMember={isMember}
          isMod={isMod}
          user={user}
          token={token}
          navigate={navigate}
          pathname={location.pathname}
          isMobile={isMobile}
        />

        <div className="relative md:center-main-content">
          <div>
            <div className="flex items-center justify-between gap-2">
              <SetSortByType
                sortByType={sortByType}
                setSortByType={setSortByType}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
              />

              {isMobile && (
                <ShowHideButton
                  show={showSidebar}
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="mb-2"
                  label="about"
                />
              )}
            </div>

            {(!isMobile || !showSidebar) && (
              <>
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
              </>
            )}
          </div>

          {(!isMobile || showSidebar) && (
            <CommunitySidebar
              token={token}
              community={community}
              isMod={false}
              navigate={navigate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

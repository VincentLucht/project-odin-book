import { useEffect, useState } from 'react';
import useAuth from '@/context/auth/hook/useAuth';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import CommunityHeader from '@/Main/Community/components/CommunityHeader/CommunityHeader';
import SetSortByType from '@/Main/Community/components/CommunityHeader/components/SetSortByType';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';
import CommunitySidebar from '@/Main/Community/components/CommunitySidebar/CommunitySidebar';

import handleFetchCommunity from '@/Main/Community/api/fetch/handleFetchCommunity';
import getCommunityName from '@/Main/Community/util/getCommunityName';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

export type SortByType = 'hot' | 'new' | 'top';
export type TimeFrame = 'day' | 'week' | 'month' | 'year' | 'all';

// TODO: Add no posts
export default function Community() {
  const location = useLocation();

  const [community, setCommunity] = useState<FetchedCommunity | null>(null);
  const [posts, setPosts] = useState<DBPostWithCommunityName[]>([]);

  const communityName = getCommunityName(location.pathname);
  const [sortByType, setSortByType] = useState<SortByType>('hot');
  const [timeframe, setTimeframe] = useState<TimeFrame>('day');

  const { user, token } = useAuth();
  const navigate = useNavigate();

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

  // console.log(community);

  return (
    <div className="-mt-3 overflow-y-scroll p-4 center-main">
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

            {posts.map((post, index) => (
              <PostOverview
                post={post}
                userId={user?.id}
                token={token}
                setPosts={setPosts}
                navigate={navigate}
                key={index}
                showPoster={true}
                poster={post.poster}
                showMembership={false}
              />
            ))}
          </div>

          <CommunitySidebar community={community} />
        </div>
      </div>
    </div>
  );
}

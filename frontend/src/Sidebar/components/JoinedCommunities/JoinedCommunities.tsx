import { useEffect, useState } from 'react';

import ShowOrHideTab from '@/Sidebar/components/ui/ShowOrHideTab';
import SidebarButton from '@/Sidebar/components/ui/SidebarButton';

import getJoinedCommunities from '@/Sidebar/components/JoinedCommunities/api/getJoinedCommunities';
import catchError from '@/util/catchError';

import { JoinedCommunity } from '@/Sidebar/components/JoinedCommunities/api/getJoinedCommunities';
import { NavigateFunction } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

interface JoinedCommunitiesProps {
  navigate: NavigateFunction;
  token: string;
}

export default function JoinedCommunities({ navigate, token }: JoinedCommunitiesProps) {
  const [joinedCommunities, setJoinedCommunities] = useState<JoinedCommunity[]>([]);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    getJoinedCommunities(token, page)
      .then((response) => {
        setHasMore(response.hasMore);
        setJoinedCommunities((prev) => {
          // avoid duplicates
          const newIds = new Set(
            response.joinedCommunities.map(({ community }) => community.id),
          );
          const filtered = prev.filter(({ community }) => !newIds.has(community.id));
          return [...filtered, ...response.joinedCommunities];
        });
      })
      .catch((error) => {
        catchError(error);
      });
  }, [token, page]);

  return (
    <div>
      <ShowOrHideTab
        show={show}
        tabName="Communities"
        setShow={setShow}
        className="flex flex-col gap-[6px]"
      >
        <SidebarButton
          navigate={() => navigate('/create-community')}
          buttonName="Create a community"
          icon={<PlusIcon className="h-8 w-8" />}
          className="gap-2"
        />

        {joinedCommunities?.map(({ community }) => (
          <SidebarButton
            navigate={() => navigate(`r/${community.name}`)}
            buttonName={community.name}
            key={community.id}
            src={
              community.profile_picture_url
                ? community.profile_picture_url
                : '/community-default.svg'
            }
            className="gap-2"
            imgClassName="h-8 w-8 rounded-full border"
          />
        ))}
        {joinedCommunities.length === 0 ? (
          <div className="max-w-[215px] px-4 py-2 df">No joined communities yet</div>
        ) : (
          hasMore && (
            <SidebarButton
              navigate={() => setPage((prev) => prev + 1)}
              buttonName="Load more"
            />
          )
        )}
      </ShowOrHideTab>
    </div>
  );
}

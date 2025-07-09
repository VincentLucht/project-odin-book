import { useState } from 'react';
import useRecentCommunities from '@/Sidebar/components/RecentCommunities/context/useRecentCommunities';

import isCurrentCommunity from '@/Sidebar/components/RecentCommunities/util/isCurrentCommunity';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import ShowOrHideTab from '@/Sidebar/components/ui/ShowOrHideTab';

import { NavigateFunction } from 'react-router-dom';

interface RecentCommunitiesProps {
  navigate: NavigateFunction;
  route: string;
}

export default function RecentCommunities({ navigate, route }: RecentCommunitiesProps) {
  const [show, setShow] = useState(false);
  const { recentCommunities } = useRecentCommunities();

  return (
    <div>
      <ShowOrHideTab
        show={show}
        tabName="Recent"
        setShow={setShow}
        className="flex flex-col gap-[6px]"
      >
        {recentCommunities?.map((recent) => (
          <SidebarButton
            navigate={() => navigate(`r/${recent.community.name}`)}
            buttonName={recent.community.name}
            src={`${recent.community.profile_picture_url ? recent.community.profile_picture_url : '/community-default.svg'}`}
            alt={`Link to r/${recent.community.name}`}
            className={`gap-2 ${isCurrentCommunity(route, recent.community.name) ? 'bg-accent-gray' : ''}`}
            imgClassName="border rounded-full w-8 h-8"
            key={recent.id}
          />
        ))}
      </ShowOrHideTab>
    </div>
  );
}

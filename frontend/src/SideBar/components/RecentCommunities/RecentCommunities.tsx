import { useState } from 'react';
import useRecentCommunities from '@/Sidebar/components/RecentCommunities/context/useRecentCommunities';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import ShowOrHideTab from '@/Sidebar/components/ui/ShowOrHideTab';

import { NavigateFunction } from 'react-router-dom';

interface RecentCommunitiesProps {
  navigate: NavigateFunction;
}

export default function RecentCommunities({ navigate }: RecentCommunitiesProps) {
  const [show, setShow] = useState(false);
  const { recentCommunities } = useRecentCommunities();

  return (
    <div>
      <ShowOrHideTab show={show} tabName="Recent" setShow={setShow}>
        {recentCommunities?.map((recent) => (
          <SidebarButton
            navigate={() => navigate(`r/${recent.community.name}`)}
            buttonName={recent.community.name}
            src={`${recent.community.profile_picture_url ? recent.community.profile_picture_url : '/community-default.svg'}`}
            alt={`Link to r/${recent.community.name}`}
            imgClassName="border rounded-full w-8 h-8"
            key={recent.id}
          />
        ))}
      </ShowOrHideTab>
    </div>
  );
}

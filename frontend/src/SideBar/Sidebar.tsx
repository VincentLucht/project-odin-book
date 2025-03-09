import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';
import useSetActiveButton from '@/Sidebar/hooks/useSetActiveButton';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import Separator from '@/components/Separator';
import SidebarNotLoggedIn from '@/Sidebar/components/SidebarNotLoggedIn/SidebarNotLoggedIn';
import RecentCommunities from '@/Sidebar/components/RecentCommunities/RecentCommunities';
import JoinedCommunities from '@/Sidebar/components/JoinedCommunities/JoinedCommunities';
import Resources from '@/Sidebar/components/Resources/Resources';

export default function Sidebar() {
  const [activeButton, setActiveButton] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  useSetActiveButton(location, setActiveButton);

  if (!user) {
    return <SidebarNotLoggedIn />;
  }

  return (
    <nav className="h-[calc(100dvh-56px)] w-[270px] overflow-y-scroll border-r text-sm bg-gray">
      <div className="flex-col py-4 df">
        <SidebarButton
          navigate={() => navigate('')}
          buttonName="Home"
          src={activeButton === 'Home' ? '/home.svg' : '/home-outline.svg'}
          alt="Home"
        />

        <SidebarButton
          navigate={() => navigate('/popular')}
          buttonName="Popular"
          src={
            activeButton === 'trending'
              ? '/trending-up.svg'
              : '/trending-up-outline.svg'
          }
          alt="Trending"
        />

        <Separator mode="sidebar" />
        <RecentCommunities navigate={navigate} />

        <Separator mode="sidebar" />
        <JoinedCommunities navigate={navigate} token={token} />

        <Separator mode="sidebar" />
        <Resources navigate={navigate} />
      </div>
    </nav>
  );
}

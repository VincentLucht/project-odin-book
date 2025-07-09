import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import Separator from '@/components/Separator';
import RecentCommunities from '@/Sidebar/components/RecentCommunities/RecentCommunities';
import JoinedCommunities from '@/Sidebar/components/JoinedCommunities/JoinedCommunities';
import Resources from '@/Sidebar/components/Resources/Resources';
import { HouseIcon, ArrowUpWideNarrow } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const route = location.pathname;

  return (
    <nav
      className="h-[calc(100dvh-56px)] w-[270px] overflow-y-scroll overscroll-contain border-r text-sm
        bg-gray"
    >
      <div className="flex-col py-4 df">
        <div className="flex flex-col gap-[6px]">
          {user && (
            <SidebarButton
              navigate={() => navigate('')}
              buttonName="Home"
              alt="Home"
              icon={<HouseIcon />}
              className={route === '/' ? 'bg-accent-gray' : ''}
            />
          )}

          <SidebarButton
            navigate={() => navigate('/popular')}
            buttonName="Popular"
            alt="Trending"
            className={` ${route === '/popular' ? 'bg-accent-gray' : ''}`}
            icon={<ArrowUpWideNarrow className="-mr-[2px] ml-[2px]" />}
          />
        </div>

        {user && (
          <>
            <Separator mode="sidebar" />
            <RecentCommunities navigate={navigate} route={route} />
          </>
        )}

        {user && (
          <>
            <Separator mode="sidebar" />
            <JoinedCommunities navigate={navigate} token={token} />
          </>
        )}

        <Separator mode="sidebar" />
        <Resources navigate={navigate} route={route} isLoggedIn={user !== null} />
      </div>
    </nav>
  );
}

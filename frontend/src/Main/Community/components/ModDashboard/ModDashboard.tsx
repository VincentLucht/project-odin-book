import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useClickOutside from '@/hooks/useClickOutside';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';

import Header from '@/Header/Header';
import ModSidebar from '@/Main/Community/components/ModDashboard/components/ModSidebar/ModSidebar';
import { Outlet } from 'react-router-dom';

import getCommunityName from '@/Main/Community/util/getCommunityName';

export default function ModDashboard() {
  const [search, setSearch] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useClickOutside(() => {
    if (!isDesktop) {
      setShowSidebar(false);
    }
  }, headerRef);
  const { isDesktop } = useGetScreenSize();

  const location = useLocation();

  useEffect(() => {
    const communityName = getCommunityName(location.pathname);
  }, [location]);

  return (
    <div>
      <Header
        headerRef={headerRef}
        search={search}
        setSearch={setSearch}
        isDesktop={isDesktop}
      />

      <div
        className={`grid flex-1 overflow-hidden
          ${isDesktop ? 'grid-cols-[320px_auto]' : 'grid-cols-[auto]'} `}
      >
        <div
          ref={sidebarRef}
          className={`z-20 h-full transform transition-transform duration-200 ${
            showSidebar
              ? isDesktop
                ? 'relative'
                : 'absolute translate-x-0'
              : 'absolute -translate-x-full'
            }`}
        >
          <ModSidebar />
        </div>

        <Outlet />
      </div>
    </div>
  );
}

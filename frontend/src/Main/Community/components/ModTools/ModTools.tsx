import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import useClickOutside from '@/hooks/useClickOutside';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import useIsModerator from '@/hooks/useIsModerator';

import Header from '@/Header/Header';
import ModSidebar from '@/Main/Community/components/ModTools/components/ModSidebar/ModSidebar';
import { Outlet } from 'react-router-dom';

import getCommunityName from '@/Main/Community/util/getCommunityName';
import { getModInfo } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import '/src/Main/Community/components/ModTools/css/ModTools.css';

import { CommunityModeration } from '@/Main/Community/components/ModTools/api/communityModerationAPI';

export interface ModToolsContext {
  community: CommunityModeration;
  setCommunity: React.Dispatch<React.SetStateAction<CommunityModeration | null>>;
  token: string | null;
}

export default function ModTools() {
  const [search, setSearch] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const [communityName, setCommunityName] = useState('');
  const [community, setCommunity] = useState<CommunityModeration | null>(null);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useClickOutside(() => {
    if (!isDesktop) {
      setShowSidebar(false);
    }
  }, headerRef);

  const location = useLocation();
  const { isDesktop, isMobile, isBelow550px } = useGetScreenSize();
  const { user, token } = useAuthGuard();
  const isMod = useIsModerator(user, community?.community_moderators);

  useEffect(() => {
    setCommunityName(getCommunityName(location.pathname));
  }, [location]);

  useEffect(() => {
    const getCommunity = () => {
      setLoading(true);

      if (!communityName) return;
      void getModInfo(token, { community_name: communityName }).then((response) => {
        setLoading(false);
        if (response === false) return;

        setCommunity(response);
      });
    };

    getCommunity();
  }, [token, communityName]);

  // Set sidebar visibility based on screen size
  useEffect(() => {
    setShowSidebar(isDesktop);
  }, [isDesktop]);

  // Freeze background scrolling when sidebar is open on non-desktop screens
  useEffect(() => {
    if (!isDesktop && showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktop, showSidebar]);

  if (loading) {
    return (
      <div className="mx-auto h-screen df">
        <h2 className="text-lg font-semibold">Checking moderator status</h2>

        <div className="loader ml-4 mt-2"></div>
      </div>
    );
  }

  if (!isMod) {
    return (
      <div className="mx-auto h-screen df">
        <h2 className="text-lg font-semibold">
          Could not verify if you&apos;re a moderator. Please try again.
        </h2>
      </div>
    );
  }

  return (
    <div>
      <Header
        headerRef={headerRef}
        search={search}
        setSearch={setSearch}
        isMobile={isMobile}
        isBelow550px={isBelow550px}
        setShowSidebar={setShowSidebar}
      />

      <div className={'grid flex-1 pt-[56px]'}>
        <div
          ref={sidebarRef}
          className={`fixed z-20 h-full transform transition-transform duration-200
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <ModSidebar />
        </div>

        <div className={`flex-1 ${isDesktop && showSidebar ? 'ml-[320px]' : ''}`}>
          <Outlet context={{ community, setCommunity, token } as ModToolsContext} />
        </div>
      </div>
    </div>
  );
}

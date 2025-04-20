import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useClickOutside from '@/hooks/useClickOutside';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import useIsModerator from '@/hooks/useIsModerator';

import Header from '@/Header/Header';
import ModSidebar from '@/Main/Community/components/ModTools/components/ModSidebar/ModSidebar';
import { Outlet } from 'react-router-dom';

import getCommunityName from '@/Main/Community/util/getCommunityName';
import { getModInfo } from '@/Main/Community/components/ModTools/api/communityModerationAPI';

import { CommunityModeration } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

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

  const headerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useClickOutside(() => {
    if (!isDesktop) {
      setShowSidebar(false);
    }
  }, headerRef);

  const location = useLocation();
  const { isDesktop } = useGetScreenSize();
  const { user, token } = useAuthGuard();
  const isMod = useIsModerator(user, community?.community_moderators);

  useEffect(() => {
    setCommunityName(getCommunityName(location.pathname));
  }, [location]);

  useEffect(() => {
    const getCommunity = () => {
      if (!communityName) return;
      void getModInfo(token, { community_name: communityName }, setCommunity);
    };

    getCommunity();
  }, [token, communityName]);

  // TODO: Add proper message
  if (!isMod) {
    return <div>You are not a moderator!</div>;
  }

  return (
    <div>
      <Header
        headerRef={headerRef}
        search={search}
        setSearch={setSearch}
        isDesktop={isDesktop}
      />

      <div className={'grid flex-1 pt-[56px]'}>
        <div
          ref={sidebarRef}
          className={`fixed z-20 h-full transform transition-transform duration-200
            ${showSidebar && isDesktop ? 'translate-x-0' : '-translate-x-full'}`}
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

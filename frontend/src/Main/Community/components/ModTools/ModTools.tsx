import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import useClickOutside from '@/hooks/useClickOutside';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import useIsModerator from '@/hooks/useIsModerator';
import { useNavigate } from 'react-router-dom';

import Header from '@/Header/Header';
import ModSidebar from '@/Main/Community/components/ModTools/components/ModSidebar/ModSidebar';
import { Outlet } from 'react-router-dom';
import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import getCommunityName from '@/Main/Community/util/getCommunityName';
import { leaveMod } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { getModInfo } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import '/src/Main/Community/components/ModTools/css/ModTools.css';

import { CommunityModeration } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

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
  const [showLeaveModModal, setShowLeaveModModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useClickOutside(() => {
    if (!isDesktop) {
      setShowSidebar(false);
    }
  }, headerRef);

  const location = useLocation();
  const { isDesktop, isMobile, isBelow550px } = useGetScreenSize();
  const { user, token } = useAuthGuard();
  const navigate = useNavigate();
  const isMod = useIsModerator(user, community ? true : false);

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

  if (!token) return;

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
          <ModSidebar
            setShowSidebar={setShowSidebar}
            isDesktop={isDesktop}
            setShowLeaveModModal={setShowLeaveModModal}
          />
        </div>

        <div className={`flex-1 ${isDesktop && showSidebar ? 'ml-[320px]' : ''}`}>
          <Outlet context={{ community, setCommunity, token } as ModToolsContext} />
        </div>
      </div>

      <Modal show={showLeaveModModal} onClose={() => setShowLeaveModModal(false)}>
        <ModalHeader
          headerName={`Leave mod team of r/${communityName}`}
          description={`You will immediately lose your moderator status and all associated permissions. 
This action cannot be undone - you'll need to be re-invited by the owner to regain access.`}
          onClose={() => setShowLeaveModModal(false)}
        />

        <ModalFooter
          confirmButtonName="Leave"
          onClose={() => setShowLeaveModModal(false)}
          submitting={submitting}
          onClick={() => {
            if (!community) return;

            setSubmitting(true);

            void leaveMod(token, { community_id: community.id }, () => {
              setSubmitting(false);
              navigate(`/r/${community.name}`);
              toast.success(`Successfully left mod team of r/${community.name}`);
            });
          }}
        />
      </Modal>
    </div>
  );
}

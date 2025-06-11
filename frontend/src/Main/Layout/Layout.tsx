import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';
import useClickOutside from '@/hooks/useClickOutside';

import Header from '@/Header/Header';
import Sidebar from '@/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [search, setSearch] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);

  const headerRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useClickOutside(() => {
    if (!isDesktop) {
      setShowSidebar(false);
    }
  }, headerRef);
  const { isMobile, isDesktop, isBelow550px } = useGetScreenSize();

  const location = useLocation();

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

  // Close open Sidebar on URL change
  useEffect(() => {
    if (!isDesktop) {
      setShowSidebar(false);
    }
  }, [location.pathname, isDesktop]);

  return (
    <div className="mx-auto flex h-dvh flex-col transition-all">
      <Header
        search={search}
        setSearch={setSearch}
        isMobile={isMobile}
        isBelow550px={isBelow550px}
        setShowSidebar={setShowSidebar}
        headerRef={headerRef}
      />

      <div className="flex-1 pt-[56px]">
        <div className="flex h-full">
          <div
            ref={sidebarRef}
            className={`fixed top-[56px] z-20 w-[270px] transition-transform duration-200
              ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
          >
            <Sidebar />
          </div>

          <div className={`flex-1 ${isDesktop && showSidebar ? 'ml-[270px]' : ''}`}>
            <Outlet />
          </div>
        </div>
      </div>

      {/* Overlay: Only render on non‑desktop when the sidebar is open */}
      {!isDesktop && showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 top-[56px] bg-black bg-opacity-25"
        />
      )}
    </div>
  );
}

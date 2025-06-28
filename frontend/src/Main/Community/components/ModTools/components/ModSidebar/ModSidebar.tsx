import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';

interface ModSidebarProps {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  isDesktop: boolean;
}

export default function ModSidebar({ setShowSidebar, isDesktop }: ModSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [route, setRoute] = useState('');

  useEffect(() => {
    const path = location.pathname;
    const currentRoute = path
      .split('/')
      .filter((segment) => segment)
      .pop();

    setRoute(currentRoute ?? '');
  }, [location.pathname]);

  const handleNavigateAndClose = (route: string) => {
    if (!isDesktop) {
      setShowSidebar(false);
    }
    navigate(route);
  };

  return (
    <nav className="h-[calc(100dvh)] w-[320px] overflow-y-scroll border-r py-6 text-sm bg-gray">
      <div className="flex-col gap-[6px] py-4 df">
        <SidebarButton
          navigate={() => handleNavigateAndClose('queue')}
          buttonName="Queue"
          className={`${route === 'queue' && 'bg-accent-gray'}`}
        />
        <SidebarButton
          navigate={() => handleNavigateAndClose('modmail')}
          buttonName="Mod Mail"
          className={`${route === 'modmail' && 'bg-accent-gray'}`}
        />
        <SidebarButton
          navigate={() => handleNavigateAndClose('members')}
          buttonName="Mods & Members"
          className={`${route === 'members' && 'bg-accent-gray'}`}
        />
        <SidebarButton
          navigate={() => handleNavigateAndClose('settings')}
          buttonName="Settings"
          className={`${ (route === 'settings' || route === 'post-flair' || route === 'user-flair') &&
            'bg-accent-gray' }`}
        />
      </div>
    </nav>
  );
}

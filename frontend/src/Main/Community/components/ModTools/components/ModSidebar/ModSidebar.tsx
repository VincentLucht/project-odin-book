import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';

export default function ModSidebar() {
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

  return (
    <nav className="h-[calc(100dvh)] w-[320px] overflow-y-scroll border-r py-6 text-sm bg-gray">
      <div className="flex-col gap-[6px] py-4 df">
        <SidebarButton
          navigate={() => navigate('queue')}
          buttonName="Queue"
          className={`${route === 'queue' && 'bg-accent-gray'}`}
        />

        <SidebarButton
          navigate={() => navigate('modmail')}
          buttonName="Mod Mail"
          className={`${route === 'modmail' && 'bg-accent-gray'}`}
        />

        <SidebarButton
          navigate={() => navigate('settings')}
          buttonName="Settings"
          className={`${route === 'settings' && 'bg-accent-gray'}`}
        />
      </div>
    </nav>
  );
}

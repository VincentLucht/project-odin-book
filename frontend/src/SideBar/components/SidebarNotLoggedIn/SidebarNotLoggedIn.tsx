import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSetActiveButton from '@/Sidebar/hooks/useSetActiveButton';

import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import Separator from '@/components/Separator';

export default function SidebarNotLoggedIn() {
  const [activeButton, setActiveButton] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useSetActiveButton(location, setActiveButton);

  return (
    <nav className="h-full w-[270px] border-r bg-gray">
      <div className="flex-col pt-4 df">
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
      </div>
    </nav>
  );
}

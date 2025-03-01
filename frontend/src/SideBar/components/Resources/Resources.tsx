import { useState } from 'react';

import ShowOrHideTab from '@/Sidebar/components/ui/ShowOrHideTab';
import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import { NavigateFunction } from 'react-router-dom';

interface ResourcesProps {
  navigate: NavigateFunction;
}

export default function Resources({ navigate }: ResourcesProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <ShowOrHideTab show={show} tabName="Resources" setShow={setShow}>
        <SidebarButton
          navigate={() => navigate('/about-reddnir')}
          buttonName="About Reddnir"
        />

        <SidebarButton navigate={() => navigate('/help')} buttonName="Help" />

        <SidebarButton
          navigate={() => navigate('https://github.com/VincentLucht/project-odin-book')}
          buttonName="Source Code"
        />
      </ShowOrHideTab>
    </div>
  );
}

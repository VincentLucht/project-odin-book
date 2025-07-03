import { useState } from 'react';

import ShowOrHideTab from '@/Sidebar/components/ui/ShowOrHideTab';
import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import { NavigateFunction } from 'react-router-dom';

interface ResourcesProps {
  navigate: NavigateFunction;
  route: string;
}

export default function Resources({ navigate, route }: ResourcesProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <ShowOrHideTab
        show={show}
        tabName="Resources"
        setShow={setShow}
        className="flex flex-col gap-[6px]"
      >
        <SidebarButton
          navigate={() => navigate('/saved')}
          buttonName="Saved Posts & Comments"
          className={`${route === '/saved' ? 'bg-hover-gray' : ''}`}
        />

        <SidebarButton
          navigate={() => navigate('/about')}
          buttonName="About Reddnir"
          className={`${route === '/about' ? 'bg-hover-gray' : ''}`}
        />

        <SidebarButton
          navigate={() => navigate('/help')}
          buttonName="Help"
          className={`${route === '/help' ? 'bg-hover-gray' : ''}`}
        />

        <SidebarButton
          navigate={() =>
            (window.location.href = 'https://github.com/VincentLucht/project-odin-book')
          }
          buttonName="Source Code"
        />
      </ShowOrHideTab>
    </div>
  );
}

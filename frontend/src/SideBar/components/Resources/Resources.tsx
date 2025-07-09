import { useState } from 'react';

import ShowOrHideTab from '@/Sidebar/components/ui/ShowOrHideTab';
import SidebarButton from '@/Sidebar/components/ui/SidebarButton';
import { Link } from 'react-router-dom';

import { NavigateFunction } from 'react-router-dom';

interface ResourcesProps {
  navigate: NavigateFunction;
  route: string;
  isLoggedIn: boolean;
}

export default function Resources({ navigate, route, isLoggedIn }: ResourcesProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <ShowOrHideTab
        show={show}
        tabName="Resources"
        setShow={setShow}
        className="flex flex-col gap-[6px]"
      >
        {isLoggedIn && (
          <SidebarButton
            navigate={() => navigate('/saved')}
            buttonName="Saved Posts & Comments"
            className={`${route === '/saved' ? 'bg-hover-gray' : ''}`}
          />
        )}

        <SidebarButton
          navigate={() => navigate('/about')}
          buttonName="About Reddnir"
          className={`${route === '/about' ? 'bg-hover-gray' : ''}`}
        />

        {/* <SidebarButton
          navigate={() => navigate('/help')}
          buttonName="Help"
          className={`${route === '/help' ? 'bg-hover-gray' : ''}`}
        /> */}

        <Link to={'https://github.com/VincentLucht/project-odin-book'}>
          <SidebarButton navigate={() => void 0} buttonName="Source Code" />
        </Link>
      </ShowOrHideTab>
    </div>
  );
}

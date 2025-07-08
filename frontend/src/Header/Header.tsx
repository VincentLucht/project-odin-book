import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAuth from '@/context/auth/hook/useAuth';

import Logo from '@/Header/components/Logo/Logo';
import InputWithImg from '@/components/InputWithImg';
import CreateButton from '@/Header/components/CreateButton/CreateButton';
import NotificationButton from '@/Header/components/NotificationButton/NotificationButton';
import UserButton from '@/Header/components/UserButton/UserButton';
import ChatButton from '@/Header/components/ChatButton/ChatButton';
import { MenuIcon } from 'lucide-react';

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isMobile: boolean;
  isBelow550px: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  headerRef: React.RefObject<HTMLElement>;
}

export default function Header({
  search,
  setSearch,
  isMobile,
  isBelow550px,
  setShowSidebar,
  headerRef,
}: HeaderProps) {
  const [showDropDown, setShowDropDown] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSearch = () => {
    if (search.length !== 0) {
      navigate(`/search/posts?q=${search}&sbt=relevance&t=all`);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryValue = queryParams.get('q');

    if (queryValue) {
      setSearch(queryValue);
    }
  }, [location.search, setSearch]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-30 grid max-h-[56px] min-h-[56px] bg-gray
        ${isMobile ? 'grid-cols-[7%_7%_auto_max-content] gap-3 max-[499px]:grid-cols-[7%_auto_max-content]' : 'grid-cols-[5%_20%_45%_30%]'}
        border-b px-4 py-2`}
      ref={headerRef}
    >
      <div
        className="bg-hover-transition max-[500px]:-ml-2"
        onClick={() => setShowSidebar && setShowSidebar((prev) => !prev)}
      >
        <MenuIcon />
      </div>

      <div className="hide-below-500 flex justify-start">
        <Logo />
      </div>

      <InputWithImg
        value={search}
        setterFunc={setSearch}
        src="/magnify.svg"
        alt="magnifying glass"
        placeholder={isBelow550px ? 'Search' : 'Search Reddnir'}
        className="bg-accent-gray"
        onSubmit={onSearch}
        deleteButton={true}
      />

      <div className={`flex justify-end ${isBelow550px ? '' : 'gap-1'}`}>
        {isLoggedIn && (
          <>
            <ChatButton />

            <CreateButton location={location} navigate={navigate} />

            <NotificationButton />
          </>
        )}

        <UserButton
          showDropDown={showDropDown === 'dropdown1'}
          setShowDropDown={setShowDropDown}
          dropdownId="dropdown1"
        />
      </div>
    </header>
  );
}

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
  isDesktop: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  headerRef: React.RefObject<HTMLElement>;
}

export default function Header({
  search,
  setSearch,
  isDesktop,
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
        ${isDesktop ? 'grid-cols-[30%_40%_30%]' : 'grid-cols-[5%_25%_40%_30%]'} border-b px-4
        py-2`}
      ref={headerRef}
    >
      {!isDesktop && (
        <div
          className="bg-hover-transition"
          onClick={() => setShowSidebar && setShowSidebar((prev) => !prev)}
        >
          <MenuIcon />
        </div>
      )}

      <div className="flex justify-start">
        <Logo />
      </div>

      <InputWithImg
        value={search}
        setterFunc={setSearch}
        src="/magnify.svg"
        alt="magnifying glass"
        placeholder="Search Reddnir"
        className="bg-accent-gray"
        onSubmit={onSearch}
        deleteButton={true}
      />

      <div className="flex justify-end gap-1">
        {isLoggedIn && (
          <>
            <ChatButton />

            <CreateButton />

            <NotificationButton onClick={() => navigate('/notifications')} />
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

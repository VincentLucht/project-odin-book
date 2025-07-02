import useAuth from '@/context/auth/hook/useAuth';

import LoginButton from '@/Header/components/LoginButton/LoginButton';
import UserPFP from '@/components/user/UserPFP';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import useClickOutside from '@/hooks/useClickOutside';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import { SettingsIcon, LogOutIcon, BookmarkIcon } from 'lucide-react';

interface UserButtonProps {
  showDropDown: boolean;
  setShowDropDown: React.Dispatch<React.SetStateAction<string | null>>;
  dropdownId: string;
}

export default function UserButton({
  showDropDown,
  setShowDropDown,
  dropdownId,
}: UserButtonProps) {
  const { isLoggedIn, user, logout } = useAuth();

  const dropdownRef = useClickOutside(() => {
    setShowDropDown(null);
  });

  if (!isLoggedIn) {
    return <LoginButton />;
  }

  return (
    <div className="df" ref={dropdownRef}>
      <div>
        <UserPFP
          url={user.profile_picture_url}
          onClick={() =>
            setShowDropDown((prev) => (prev === dropdownId ? null : dropdownId))
          }
        />
      </div>

      <DropdownMenu
        className={`right-[20px] min-w-[256px] rounded-md transition-opacity duration-300 df
          ${showDropDown ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none -z-10 opacity-0'} `}
      >
        <DropdownButton
          text="View Profile"
          subText={user.username}
          src={`${user.profile_picture_url ? user.profile_picture_url : '/user.svg'}`}
          alt="View Profile"
          route={`/user/${user.username}`}
          size="large"
          imgClassName="rounded-full border h-[32px] w-[32px]"
          setterFunc={setShowDropDown}
          show={showDropDown}
        />

        <DropdownButton
          text="Settings"
          icon={<SettingsIcon strokeWidth={1.5} />}
          route="/user/settings"
          setterFunc={setShowDropDown}
          show={showDropDown}
        />

        <DropdownButton
          text="Saved"
          icon={<BookmarkIcon strokeWidth={1.5} />}
          route="/saved"
          setterFunc={setShowDropDown}
          show={showDropDown}
        />

        <DropdownButton
          text="Log out"
          icon={<LogOutIcon className="pl-[2px]" />}
          show={showDropDown}
          customFunc={logout}
        />
      </DropdownMenu>
    </div>
  );
}

import useAuth from '@/context/auth/hook/useAuth';

import LoginButton from '@/Header/components/LoginButton/LoginButton';
import UserPFP from '@/components/user/UserPFP';
import DropDownMenu from '@/components/DropDownMenu/DropDownMenu';
import useClickOutside from '@/hooks/useClickOutside';

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
  const { isLoggedIn, user } = useAuth();

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

      <DropDownMenu
        setterFunc={setShowDropDown}
        className={`bg-hover-transition right-[20px] min-w-[256px] rounded-md df
          ${showDropDown ? 'opacity-100' : 'opacity-0'} `}
      />
    </div>
  );
}

import useAuth from '@/context/auth/hook/useAuth';

import DropDownButton from '@/components/DropDownMenu/components/DropDownButton';

interface DropDownMenuProps {
  setterFunc: React.Dispatch<React.SetStateAction<string | null>>;
  className?: string;
}

export default function DropDownMenu({ setterFunc, className }: DropDownMenuProps) {
  const { user } = useAuth();

  if (!user) {
    return;
  }

  return (
    // TODO: Add box shadow
    <div className={`bg-accent-gray absolute top-[58px] flex-col py-2 df ${className}`}>
      <DropDownButton
        text="View Profile"
        subText={user.username}
        src={`${user.profile_picture_url}`}
        alt="View Profile"
        route={`/user/${user.username}`}
        size="large"
        imgClassName="rounded-full border h-[32px] w-[32px]"
        setterFunc={setterFunc}
      />

      <DropDownButton
        text="Settings"
        src="/cog-outline.svg"
        alt="Settings"
        route="/user/settings"
        setterFunc={setterFunc}
      />
    </div>
  );
}

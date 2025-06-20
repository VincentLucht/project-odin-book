import CommunityFlairTag from '@/Main/Global/CommunityFlairTag';
import PFP from '@/components/PFP';

import { NavigateFunction } from 'react-router-dom';

interface UserCardProps {
  profile_picture_url: string | null;
  username: string;
  navigate?: NavigateFunction;
  userFlair?: {
    name: string;
    emoji: string | null;
    textColor: string;
    color: string;
  };
  hoverEffect?: boolean;
}

export default function UserCard({
  profile_picture_url,
  username,
  navigate,
  userFlair,
  hoverEffect = false,
}: UserCardProps) {
  return (
    <button
      className={`group -mx-2 flex h-12 items-center gap-2 rounded-md px-2 text-sm ${ hoverEffect &&
        'cursor-pointer transition-colors bg-transition-hover-2' }`}
      onClick={() => navigate?.(`/user/${username}`)}
    >
      <div className="bg-hover-transition">
        <PFP src={profile_picture_url} mode="user" className="h-8 w-8" />
      </div>

      <div>
        <div className="group-hover:underline">u/{username}</div>

        {userFlair && <CommunityFlairTag flair={userFlair} />}
      </div>
    </button>
  );
}

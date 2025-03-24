import CommunityFlairTag from '@/components/CommunityFlairTag';
import { NavigateFunction } from 'react-router-dom';

interface UserCardProps {
  profile_picture_url: string | null;
  username: string;
  navigate: NavigateFunction;
  userFlair?: {
    name: string;
    emoji: string | null;
    textColor: string;
    color: string;
  };
}

export default function UserCard({
  profile_picture_url,
  username,
  navigate,
  userFlair,
}: UserCardProps) {
  return (
    <div
      className="-mx-2 flex h-12 cursor-pointer items-center gap-2 rounded-md px-2 text-sm
        transition-colors bg-transition-hover-2"
      onClick={() => navigate(`/user/${username}`)}
    >
      <img
        src={profile_picture_url ? profile_picture_url : 'user.svg'}
        alt="Community moderator profile picture"
        className="h-8 w-8 rounded-full border object-cover"
      />

      <div>
        <div>u/{username}</div>

        {userFlair && <CommunityFlairTag flair={userFlair} />}
      </div>
    </div>
  );
}

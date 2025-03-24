import PFP from '@/components/PFP';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import Separator from '@/components/Separator';

import formatCount from '@/components/sidebar/DisplayMemberCount.tsx/formatCount';

import { DBUser } from '@/interface/dbSchema';
import { NavigateFunction } from 'react-router-dom';

interface UserOverviewProps {
  user: DBUser;
  navigate: NavigateFunction;
}

export default function UserOverview({ user, navigate }: UserOverviewProps) {
  const { profile_picture_url, username, is_mature, comment_karma, post_karma } = user;

  const userRedirect = () => {
    navigate(`/user/${username}`);
  };

  return (
    <div>
      <Separator className="my-2" />

      <div
        className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-3 bg-transition-hover"
        onClick={userRedirect}
      >
        <div className="mt-1 flex-shrink-0 self-start">
          <PFP src={profile_picture_url} size="xl" />
        </div>

        <div>
          <div className="text-lg font-semibold">u/{username}</div>

          {is_mature && (
            <div className="-mt-1 mb-2">
              <MatureTag />
            </div>
          )}

          <div className="text-xs text-gray-secondary">
            {formatCount(comment_karma + post_karma)} karma
          </div>
        </div>
      </div>
    </div>
  );
}

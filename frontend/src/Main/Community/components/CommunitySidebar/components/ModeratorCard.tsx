import PFP from '@/components/PFP';
import { Link } from 'react-router-dom';
import Separator from '@/components/Separator';

import dayjs from 'dayjs';

import { FetchedModerator } from '@/Main/Community/components/ModTools/api/communityModerationAPI';

interface ModeratorCardProps {
  moderator: FetchedModerator;
}

export default function ModeratorCard({ moderator }: ModeratorCardProps) {
  return (
    <>
      <Separator />

      <div className="flex items-center justify-between px-2 py-4">
        <Link
          to={`/user/${moderator.user.username}`}
          className="group flex items-center gap-2"
        >
          <div className="!h-12 !w-12 df group-hover:bg-hover-transition">
            <PFP
              src={moderator.user.profile_picture_url}
              className="!h-10 !w-10"
              mode="user"
            />
          </div>

          <div className="font-semibold group-hover:underline">
            u/{moderator.user.username}
          </div>
        </Link>

        <div>
          <div>{dayjs().format('HH:mm')}</div>

          <div>{dayjs().format('MMM D, YYYY')}</div>
        </div>
      </div>
    </>
  );
}

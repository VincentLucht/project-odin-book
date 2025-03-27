import PFP from '@/components/PFP';
import MatureTag from '@/Main/Post/components/tags/common/MatureTag';
import Separator from '@/components/Separator';
import PrivateCommunityTag from '@/Main/Post/components/tags/common/PrivateCommunityTag';

import formatCount from '@/components/sidebar/DisplayMemberCount.tsx/formatCount';

import { NavigateFunction } from 'react-router-dom';
import { CommunityTypes } from '@/interface/dbSchema';

interface CommunityOverviewProps {
  name: string;
  member_amount: number;
  description: string | null;
  profile_picture_url: string | null;
  is_mature: boolean;
  type: CommunityTypes;
  navigate: NavigateFunction;
}

// TODO: Add hidden pfp for private community?
export default function CommunityOverview({
  name,
  member_amount,
  description,
  profile_picture_url,
  is_mature,
  type,
  navigate,
}: CommunityOverviewProps) {
  const isPrivate = type === 'PRIVATE';

  const communityRedirect = () => {
    navigate(`/r/${encodeURIComponent(name)}/`);
  };

  return (
    <div>
      <Separator className="my-2" />

      <div
        className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-3 bg-transition-hover"
        onClick={communityRedirect}
      >
        <div className="mt-1 flex-shrink-0 self-start">
          <PFP src={profile_picture_url} size="xl" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold">r/{name}</div>

          <div className="flex gap-2">
            {is_mature && (
              <div className="-mt-2 mb-1">
                <MatureTag />
              </div>
            )}
            {isPrivate && (
              <div className="-mt-2 mb-1">
                <PrivateCommunityTag />
              </div>
            )}
          </div>

          <div className="text-xs text-gray-secondary">
            {formatCount(member_amount)} members
          </div>

          <div className="break-all text-sm">{description}</div>
        </div>
      </div>
    </div>
  );
}

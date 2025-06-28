import { CircleCheckIcon } from 'lucide-react';

interface UserIndicatorsProps {
  isUserSelf: boolean;
  isOwner: boolean;
  isModerator: boolean;
  isApproved: boolean;
}

export default function UserIndicators({
  isUserSelf,
  isOwner,
  isModerator,
  isApproved,
}: UserIndicatorsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {isUserSelf && <div className="user-indicator-self">You</div>}

      {isOwner && (
        <div className="bg-purple-300 text-purple-800 user-indicator">Owner</div>
      )}

      {isModerator && (
        <div className="bg-blue-300 text-blue-800 user-indicator">Moderator</div>
      )}

      {isApproved && (
        <div className="!px-0 !py-0 user-indicator">
          <CircleCheckIcon className="text-green-500" />
        </div>
      )}
    </div>
  );
}

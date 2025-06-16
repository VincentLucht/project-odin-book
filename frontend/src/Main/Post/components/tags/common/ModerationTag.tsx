import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PFP from '@/components/PFP';
import { CheckIcon } from 'lucide-react';
import GiveRemovalReason from '@/Main/Global/GiveRemovalReason';

import getRelativeTime from '@/util/getRelativeTime';

import { DBCommentModeration, DBPostModeration } from '@/interface/dbSchema';
import formatDate from '@/util/formatDate';

interface ModerationTag {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  moderation: DBPostModeration | DBCommentModeration | null;
  token: string | null;
  apiData: { id: string };
  isMobile: boolean;
  className?: string;
  onUpdateRemovalReason?: (
    _postId: string,
    newReason: string,
    success: boolean,
  ) => void;
  type?: 'post' | 'comment';
  useCompactMode?: boolean;
}

// TODO: Add good looking box shadow
export default function ModerationTag({
  show,
  setShow,
  moderation,
  token,
  apiData,
  isMobile,
  className,
  onUpdateRemovalReason,
  type = 'post',
  useCompactMode,
}: ModerationTag) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  if (!moderation) return;

  const user = moderation.moderator.user;
  const approved = moderation.action === 'APPROVED';

  return (
    <div className={`gap-1 df ${className}`}>
      <div
        className="relative flex-shrink-0 rounded-full p-1 bg-transition-hover-alternate"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/user/${user.username}`)}
      >
        <button className="relative df">
          <PFP className="!h-8 !w-8" src={user.profile_picture_url} />

          {isHovered && (
            <div
              className={`absolute top-10 w-fit -translate-x-1/2 whitespace-nowrap break-words rounded-md
              bg-neutral-950 p-2 text-xs text-gray-secondary
              ${useCompactMode ? '-left-[30px]' : 'left-4'}`}
            >
              <span className="text-white">u/{user.username}</span> at{' '}
              {formatDate(moderation.created_at)}
            </div>
          )}
        </button>

        {approved ? (
          <div className="bg-green-400 absolute-circle">
            <CheckIcon className="h-3 w-3 text-bg-gray" />
          </div>
        ) : (
          <div className="bg-red-500 absolute-circle">
            <img src="/x-close-bg-gray.svg" alt="x close icon" />
          </div>
        )}
      </div>

      <span className="text-xs text-gray-secondary">
        {approved &&
          !isMobile &&
          `Approved ${getRelativeTime(moderation.created_at as unknown as Date, false)}`}

        {!approved && !moderation.reason
          ? !useCompactMode && (
              <button
                className="min-h-8 rounded-full !px-1 text-xs !font-medium prm-button normal-bg-transition md:!px-4"
                onClick={() => setShow(true)}
              >
                Add removal reason
              </button>
            )
          : !useCompactMode && (
              <div className="line-clamp-3 break-all">{moderation.reason}</div>
            )}
      </span>

      {!useCompactMode && (
        <GiveRemovalReason
          type={type}
          token={token}
          apiData={apiData}
          show={show}
          setShow={setShow}
          onUpdateRemovalReason={onUpdateRemovalReason}
        />
      )}
    </div>
  );
}

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
  className?: string;
  onUpdateRemovalReason?: (
    _postId: string,
    newReason: string,
    success: boolean,
  ) => void;
  type?: 'post' | 'comment';
}

// TODO: Add good looking box shadow
export default function ModerationTag({
  show,
  setShow,
  moderation,
  token,
  apiData,
  className,
  onUpdateRemovalReason,
  type = 'post',
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
              className="absolute left-4 top-10 w-fit -translate-x-1/2 whitespace-nowrap break-words rounded-md
                bg-neutral-950 p-2 text-xs text-gray-secondary"
            >
              <span className="text-white">u/{user.username}</span> at{' '}
              {formatDate(moderation.created_at)}
            </div>
          )}
        </button>

        {approved ? (
          <div className="absolute-circle bg-green-400">
            <CheckIcon className="h-3 w-3 text-bg-gray" />
          </div>
        ) : (
          <div className="absolute-circle bg-red-500">
            <img src="/x-close-bg-gray.svg" alt="x close icon" />
          </div>
        )}
      </div>

      <span className="text-xs text-gray-secondary">
        {approved &&
          `Approved ${getRelativeTime(moderation.created_at as unknown as Date, false)}`}

        {!approved && !moderation.reason ? (
          <button
            className="min-h-8 rounded-full text-xs !font-medium prm-button normal-bg-transition"
            onClick={() => setShow(true)}
          >
            Add removal reason
          </button>
        ) : (
          <div className="break-all">{moderation.reason}</div>
        )}
      </span>

      <GiveRemovalReason
        type={type}
        token={token}
        apiData={apiData}
        show={show}
        setShow={setShow}
        onUpdateRemovalReason={onUpdateRemovalReason}
      />
    </div>
  );
}

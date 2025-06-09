import Separator from '@/components/Separator';
import { Link } from 'react-router-dom';
import { UserHistoryUser } from '@/Main/user/UserProfile/UserProfile';
import { MessageCircleHeartIcon, MessageCirclePlusIcon } from 'lucide-react';
interface UserSidebarProps {
  userSelfId: string | undefined;
  user: UserHistoryUser | null;
}

// TODO: Add description
export default function UserSideBar({ userSelfId, user }: UserSidebarProps) {
  if (!user) {
    return null;
  }

  const { canCreate, existsOneOnOne } = user.chatProperties;

  return (
    <div className="rounded-2xl bg-black p-4 sidebar">
      <div className="flex justify-between">
        <div className="font-semibold">{user.username}</div>

        <div>Dots</div>
      </div>

      {userSelfId !== user.id && (
        <div className="my-2 flex gap-1">
          {!canCreate ? (
            <div>User disabled chat creation</div>
          ) : existsOneOnOne ? (
            <Link
              to={`/chats?openChat=${user.chatProperties.chatId}`}
              className="px-3 transition-colors interaction-button-wrapper active:bg-active-gray"
            >
              <MessageCircleHeartIcon className="w-[22px]" strokeWidth={1.5} />

              <div className="text-[13px]">Open Chat</div>
            </Link>
          ) : (
            <Link
              to={`/chats?createChat=${user.username}`}
              className="px-3 transition-colors interaction-button-wrapper active:bg-active-gray"
            >
              <MessageCirclePlusIcon className="w-[22px]" strokeWidth={1.5} />

              <div className="text-[13px]">Start Chat</div>
            </Link>
          )}
        </div>
      )}

      <div>
        <div className="text-sm text-gray-secondary">{user.description}</div>

        <Separator className="mb-2" />
      </div>

      <div className="grid grid-cols-2 gap-y-5">
        <div className="flex flex-col">
          <span className="text-sm">{user.post_karma}</span>
          <span className="text-xs text-gray-secondary">Post karma</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm">{user.comment_karma}</span>
          <span className="text-xs text-gray-secondary">Comment karma</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm">
            {user.cake_day ? user.cake_day : 'Not specified'}
          </span>

          <span className="text-xs text-gray-secondary">Cake day</span>
        </div>
      </div>
    </div>
  );
}

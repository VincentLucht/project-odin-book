import PFP from '@/components/PFP';

import { CornerUpLeftIcon } from 'lucide-react';
import NotificationDropdown from '@/Main/Notifications/components/NotificationDropdown';

import { readNotification } from '@/Main/Notifications/api/notificationAPI';
import formatTimeCompact from '@/util/formatTimeCompact';
import getNavigationLink from '@/Main/Notifications/components/util/getNavigationLink';

import { DBNotification } from '@/interface/dbSchema';
import { NavigateFunction } from 'react-router-dom';

interface NotificationProps {
  notification: DBNotification;
  token: string | null;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;
  setNotifications: React.Dispatch<React.SetStateAction<DBNotification[]>>;
}

export default function Notification({
  notification,
  token,
  showDropdown,
  setShowDropdown,
  navigate,
  setNotifications,
}: NotificationProps) {
  const senderName = notification.sender_user_id
    ? notification.sender_user?.username
    : notification.sender_community?.name;
  const senderProfilePicture = notification.sender_user_id
    ? notification.sender_user?.profile_picture_url
    : notification.sender_community?.profile_picture_url;
  const navigationUrl = getNavigationLink(notification.type, notification?.link);

  return (
    <div
      className={`bg-transition my-2 flex gap-2 rounded-md px-4 py-2 text-sm ${ !notification.read_at &&
        'bg-accent-gray' } ${navigationUrl ? 'cursor-pointer bg-transition-hover' : ''}
        ${notification.read_at ? '' : 'cursor-pointer'} `}
      onClick={(e) => {
        e.stopPropagation();

        !notification.read_at &&
          void readNotification(token, { notification_id: notification.id }, () =>
            setNotifications((prev) =>
              prev.map((notificationPrev) =>
                notificationPrev.id === notification.id
                  ? { ...notificationPrev, read_at: new Date() }
                  : notificationPrev,
              ),
            ),
          );

        if (navigationUrl) {
          navigate(navigationUrl);
        }
      }}
    >
      <PFP src={senderProfilePicture} size="large" />

      <div className="grid w-full grid-cols-[1fr_auto]">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1">
            <div className="font-medium text-hidden-ellipsis">
              {notification.subject}
            </div>

            <div className="flex-shrink-0 text-gray-secondary">
              • {formatTimeCompact(notification.created_at)}
            </div>

            {notification.is_hidden && (
              <div className="text-gray-secondary">• [HIDDEN]</div>
            )}
          </div>

          <div
            className={`text-gray-secondary ${
              notification.type === 'MODMESSAGE'
                ? 'break-all'
                : notification.type === 'MODMAILREPLY'
                  ? 'whitespace-pre-wrap'
                  : 'text-hidden-ellipsis'
              } `}
          >
            {notification.message}
          </div>

          {notification.type === 'COMMENTREPLY' && (
            <button
              className="mt-1 flex h-[32px] w-fit items-center gap-2 rounded-full bg-[rgb(78,85,87)] px-[10px]
                transition-colors active:bg-[rgb(121,131,134)]"
            >
              <CornerUpLeftIcon className="h-5 w-5 flex-shrink-0" />

              <div className="text-xs font-medium">Reply back</div>
            </button>
          )}
        </div>

        <div className="self-start">
          <NotificationDropdown
            notificationId={notification.id}
            isHidden={notification.is_hidden}
            token={token}
            show={showDropdown}
            setShow={setShowDropdown}
            setNotifications={setNotifications}
          />
        </div>
      </div>
    </div>
  );
}

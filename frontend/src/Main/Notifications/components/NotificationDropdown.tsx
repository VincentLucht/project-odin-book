import { useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import { EllipsisIcon } from 'lucide-react';

import { hideNotification } from '@/Main/Notifications/api/notificationAPI';

import { DBNotification } from '@/interface/dbSchema';

interface NotificationDropdownProps {
  notificationId: string;
  isHidden: boolean;
  token: string | null;
  show: string | null;
  setShow: React.Dispatch<React.SetStateAction<string | null>>;
  setNotifications: React.Dispatch<React.SetStateAction<DBNotification[]>>;
}

export default function NotificationDropdown({
  notificationId,
  isHidden,
  token,
  show: showDropdown,
  setShow,
  setNotifications,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useClickOutside(() => {
    setShow(null);
  }, dropdownRef);

  const onHide = () => {
    if (!token) return;

    void hideNotification(token, { notification_id: notificationId }).then(
      (success) => {
        if (!success) return;
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  is_hidden: !notification.is_hidden,
                }
              : notification,
          ),
        );
      },
    );
  };
  const show = showDropdown === notificationId;

  return (
    <div className="relative df" ref={containerRef}>
      <div
        className={`color cursor-pointer px-3 transition-colors interaction-button-wrapper-secondary
          hover:bg-[rgb(78,85,87)] active:bg-[rgb(121,131,134)]`}
        onClick={(e) => {
          e.stopPropagation();
          setShow((prev) => (prev === notificationId ? null : notificationId));
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <EllipsisIcon className="h-[18px] w-[18px]" />
      </div>

      <DropdownMenu
        className={`!-left-[216px] !top-9 min-w-[256px] rounded-md text-white transition-opacity
          duration-300 df ${show ? '!z-10 opacity-100' : '!-z-10 opacity-0'} `}
        ref={dropdownRef}
      >
        <DropdownButton
          text={`${isHidden ? 'Show notification' : 'Hide notification'}`}
          setterFunc={setShow}
          show={show}
          customFunc={() => {
            onHide();
          }}
        />
      </DropdownMenu>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import { hasUnreadNotifications } from '@/Main/Notifications/api/notificationAPI';

interface NotificationButtonProps {
  onClick: () => void;
}

export default function NotificationButton({ onClick }: NotificationButtonProps) {
  const [showUnread, setShowUnread] = useState(false);
  const { token } = useAuthGuard();
  const location = useLocation();

  useEffect(() => {
    void hasUnreadNotifications(token).then((response) => {
      if (response === false) return;

      setShowUnread(response);
    });
  }, [token]);

  useEffect(() => {
    if (location.pathname === '/notifications') {
      setShowUnread(false);
    }
  }, [location, showUnread]);

  return (
    <div
      className="relative h-10 w-10 rounded-full df bg-hover-transition hover:bg-accent-gray"
      onClick={onClick}
    >
      <img
        src="/bell-outline.svg"
        alt="User profile picture"
        className="h-6 w-6 rounded-full"
      />

      {showUnread && (
        <div className="absolute-circle !left-[22px] !top-[5px] !h-[12px] !w-[12px] rounded bg-red-600"></div>
      )}
    </div>
  );
}

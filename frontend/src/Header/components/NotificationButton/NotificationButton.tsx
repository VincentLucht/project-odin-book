import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import { Link } from 'react-router-dom';

import { BellIcon } from 'lucide-react';

import { hasUnreadNotifications } from '@/Main/Notifications/api/notificationAPI';

export default function NotificationButton() {
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
    <Link to="/notifications">
      <button className="relative bg-hover-transition">
        <BellIcon className="h-6 w-6" />

        {showUnread && (
          <div className="!left-[22px] !top-[5px] !h-[12px] !w-[12px] rounded bg-red-600 absolute-circle"></div>
        )}
      </button>
    </Link>
  );
}

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Virtuoso } from 'react-virtuoso';

import Notification from '@/Main/Notifications/components/Notification';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';

import { DBNotification } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

interface VirtualizedNotificationsProps {
  token: string | null;
  notifications: DBNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<DBNotification[]>>;
  pagination: Pagination;
  loadMore: (cursor_id: string, isInitialFetch?: boolean) => void;
  loading: boolean;
}

export default function VirtualizedNotifications({
  token,
  notifications,
  setNotifications,
  pagination,
  loadMore,
  loading,
}: VirtualizedNotificationsProps) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const ItemRenderer = useCallback(
    (index: number) => {
      const notification = notifications[index];
      if (!notification) return null;

      return (
        <div data-id={notification.id}>
          <Notification
            notification={notification}
            token={token}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            navigate={navigate}
            setNotifications={setNotifications}
          />
        </div>
      );
    },
    [notifications, token, navigate, setNotifications, showDropdown],
  );

  return (
    <div>
      <Virtuoso
        data={notifications}
        itemContent={(index) => ItemRenderer(index)}
        overscan={200}
        useWindowScroll
        scrollerRef={() => window}
        computeItemKey={(index) => notifications[index]?.id || index.toString()}
        endReached={() => {
          if (pagination.hasMore && !loading) {
            loadMore(pagination.nextCursor, false);
          }
        }}
      />

      <EndMessageHandler
        loading={loading}
        hasMorePages={pagination.hasMore}
        dataLength={notifications.length}
        noResultsMessage="No notifications found."
        className="mt-14"
      />
    </div>
  );
}

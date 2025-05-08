import { useEffect, useState, useCallback } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import VirtualizedNotifications from '@/Main/Notifications/components/VirtualizedNotifications';
import NotificationApiFilters from '@/Main/Notifications/components/NotificationApiFilters';

import {
  readAllNotifications,
  openAllNotifications,
  fetchByNotification,
} from '@/Main/Notifications/api/notificationAPI';

import { DBNotification } from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [sortByType, setSortByType] = useState<'all' | 'read' | 'unread'>('all');
  const [includeHidden, setIncludeHidden] = useState(false);
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    nextCursor: '',
    hasMore: true,
  });

  const { token } = useAuthGuard();

  const loadMore = useCallback(
    (cursor_id: string, isInitialFetch = false) => {
      void fetchByNotification(
        token,
        { cursor_id, sort_by_type: sortByType, include_hidden: includeHidden },
        (notifications, pagination) => {
          isInitialFetch
            ? setNotifications(notifications)
            : setNotifications((prev) => [...prev, ...notifications]);
          setPagination(pagination);
          setLoading(false);
        },
      );
    },
    [token, sortByType, includeHidden],
  );

  useEffect(() => {
    void openAllNotifications(token);
    loadMore('', true);
  }, [token, loadMore]);

  return (
    <div className="p-4 center-main">
      <div className="center-main-content">
        <div>
          <h2 className="mb-4 text-3xl font-bold">Notifications</h2>

          <div className="flex items-center justify-between">
            <NotificationApiFilters
              sortByType={sortByType}
              setSortByType={setSortByType}
              includeHidden={includeHidden}
              setIncludeHidden={setIncludeHidden}
            />

            <button
              className="font-medium transition-transform hover:underline active:scale-95"
              onClick={() => {
                void readAllNotifications(token, {
                  loading: 'Reading all notifications...',
                  success: 'Successfully marked all notifications as read',
                  error: 'Failed to mark all notifications as read',
                }).then((success) => {
                  if (!success) return;
                  setNotifications((prev) =>
                    prev.map((notification) => ({
                      ...notification,
                      read_at: new Date(),
                    })),
                  );
                });
              }}
            >
              Mark all as read
            </button>
          </div>

          <VirtualizedNotifications
            token={token}
            notifications={notifications}
            setNotifications={setNotifications}
            pagination={pagination}
            loadMore={loadMore}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

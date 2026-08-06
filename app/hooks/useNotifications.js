'use client';

import { useCallback, useState } from 'react';
import useApiResource from './useApiResource';
import useTestingMode from './useTestingMode';
import useAuth from './useAuth';
import mockNotifications from '../data/notifications';
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notification.service';

// Notifications only ever exist for a signed-in user — guests get an empty
// list instead of a request. Testing mode previews the bell with local mock
// data so the UI can be reviewed without a backend.
export default function useNotifications() {
  const { testingMode } = useTestingMode();
  const { isAuthenticated } = useAuth();

  const [localNotifications, setLocalNotifications] = useState(mockNotifications);

  const { data, loading, setData } = useApiResource(getMyNotifications, [isAuthenticated], {
    skip: testingMode || !isAuthenticated,
    fallback: { notifications: [], unreadCount: 0 },
  });

  const notifications = testingMode ? localNotifications : data?.notifications ?? [];
  const unreadCount = testingMode
    ? localNotifications.filter((n) => !n.isRead).length
    : data?.unreadCount ?? 0;

  const markAsRead = useCallback(
    async (id) => {
      if (testingMode) {
        setLocalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        return;
      }
      if (!isAuthenticated) return;

      await markNotificationRead(id);
      setData((prev) => ({
        notifications: (prev?.notifications ?? []).map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max((prev?.unreadCount ?? 1) - 1, 0),
      }));
    },
    [testingMode, isAuthenticated, setData]
  );

  const markAllAsRead = useCallback(async () => {
    if (testingMode) {
      setLocalNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      return;
    }
    if (!isAuthenticated) return;

    await markAllNotificationsRead();
    setData((prev) => ({
      notifications: (prev?.notifications ?? []).map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  }, [testingMode, isAuthenticated, setData]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
  };
}

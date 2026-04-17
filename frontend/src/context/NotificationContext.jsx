import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getNotificationsApi, markNotificationAsReadApi } from '../api/notification';
import { useAuth } from './AuthContext';
import { getNotificationMeta } from '../utils/org';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return [];
    }

    setIsLoading(true);
    try {
      const data = await getNotificationsApi();
      const normalized = (Array.isArray(data) ? data : []).map((notification) => {
        const meta = getNotificationMeta(notification.type);
        return {
          ...notification,
          uiType: meta.tone,
          typeLabel: meta.label,
          time: notification.isRead ? 'Read' : 'Unread',
        };
      });
      setNotifications(normalized);
      return normalized;
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      setNotifications([]);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications().catch(() => {});
  }, [isAuthenticated]);

  const markAsRead = async (id) => {
    await markNotificationAsReadApi(id);
    setNotifications((prev) =>
      prev.map((notification) =>
        String(notification.id) === String(id)
          ? { ...notification, isRead: true, time: 'Read' }
          : notification
      )
    );
  };

  const markAllAsRead = async () => {
    await Promise.all(
      notifications
        .filter((notification) => !notification.isRead)
        .map((notification) => markNotificationAsReadApi(notification.id))
    );
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true, time: 'Read' }))
    );
  };

  const getNotificationById = (id) =>
    notifications.find((notification) => String(notification.id) === String(id));

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoading,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        getNotificationById,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

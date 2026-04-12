import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(undefined);

const initialNotifications = [
  {
    id: 'n1',
    title: 'System Maintenance Scheduled',
    message: 'The platform will be down for 2 hours this Sunday at 2 AM EST.',
    time: '2 hours ago',
    type: 'warning',
    isRead: false,
    replies: [],
  },
  {
    id: 'n2',
    title: 'Document Approved',
    message: 'Your Q1 Expense Report has been approved by Finance.',
    time: 'Yesterday',
    type: 'success',
    isRead: true,
    replies: [],
  },
  {
    id: 'n3',
    title: 'Password Expiry Warning',
    message: 'Your corporate password will expire in 3 days.',
    time: '2 days ago',
    type: 'danger',
    isRead: false,
    replies: [],
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('mock_notifications');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mock_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = async (msg) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setNotifications((prev) => [
      {
        ...msg,
        id: Math.random().toString(36).substr(2, 9),
        time: 'Just now',
        isRead: false,
        replies: [],
      },
      ...prev,
    ]);
    setIsLoading(false);
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAsUnread = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
    );
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const replyToNotification = async (id, reply) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, replies: [...n.replies, reply] } : n
      )
    );
  };

  const getNotificationById = (id) =>
    notifications.find((n) => n.id === id);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        isLoading,
        addNotification,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        replyToNotification,
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
import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export interface NotificationMsg {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  isRead: boolean;
  replies: string[];
}

interface NotificationContextType {
  notifications: NotificationMsg[];
  isLoading: boolean;
  addNotification: (msg: Omit<NotificationMsg, 'id' | 'time' | 'isRead' | 'replies'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  replyToNotification: (id: string, reply: string) => Promise<void>;
  getNotificationById: (id: string) => NotificationMsg | undefined;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: NotificationMsg[] = [
  { id: 'n1', title: 'System Maintenance Scheduled', message: 'The platform will be down for 2 hours this Sunday at 2 AM EST.', time: '2 hours ago', type: 'warning', isRead: false, replies: [] },
  { id: 'n2', title: 'Document Approved', message: 'Your Q1 Expense Report has been approved by Finance.', time: 'Yesterday', type: 'success', isRead: true, replies: [] },
  { id: 'n3', title: 'Password Expiry Warning', message: 'Your corporate password will expire in 3 days.', time: '2 days ago', type: 'danger', isRead: false, replies: [] },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMsg[]>(initialNotifications);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mock_notifications');
    if (saved) {
      try { setNotifications(JSON.parse(saved)); } catch (e) { localStorage.removeItem('mock_notifications'); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mock_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = async (msg: Omit<NotificationMsg, 'id' | 'time' | 'isRead' | 'replies'>) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    setNotifications((prev) => [
      { ...msg, id: Math.random().toString(36).substr(2, 9), time: 'Just now', isRead: false, replies: [] },
      ...prev
    ]);
    setIsLoading(false);
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAsUnread = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };
  
  const replyToNotification = async (id: string, reply: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, replies: [...n.replies, reply] } : n)));
  };

  const getNotificationById = (id: string) => notifications.find((n) => n.id === id);

  return (
    <NotificationContext.Provider value={{ notifications, isLoading, addNotification, markAsRead, markAsUnread, markAllAsRead, replyToNotification, getNotificationById }}>
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

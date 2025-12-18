import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Achievement } from '../achievements';

export interface Notification {
  id: number;
  achievement: Achievement;
}

interface NotificationContextType {
  addNotification: (achievement: Achievement) => void;
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((achievement: Achievement) => {
    const newNotification: Notification = {
      id: Date.now(),
      achievement,
    };
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

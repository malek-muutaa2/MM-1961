// hooks/useNotifications.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { notificationTypes, typenotifications } from '@/lib/db/schema';

export function useNotifications(userId: number) {
  const [notifications, setNotifications] = useState<typenotifications[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, read_at: new Date() } : n
          )
        );
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`/api/notifications/stream`);

    eventSource.addEventListener('initial', (event) => {
      const data = JSON.parse(event.data) as Notification[];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read_at).length);
      setIsConnected(true);
    });

    eventSource.addEventListener('update', (event) => {
      const newNotifications = JSON.parse(event.data) as notificationTypes;
    let notificationupdate = []
    // Ensure newNotifications is always an array of objects
    const notificationArray = Array.isArray(newNotifications) ? newNotifications : [newNotifications];

    const filteredNotifications = notificationArray.filter(n => n.user_id === userId);
    setNotifications(prev => [...filteredNotifications, ...prev]);
      setUnreadCount(prev => prev + notificationArray.filter(n => !n.read_at).length);
      console.log('New notificationssqqs received:', filteredNotifications);
      
    //   // Show toast for new notifications
    //   newNotifications.forEach(notification => {
    //     if (Notification.permission === 'granted') {
    //       new Notification(notification.title, {
    //         body: notification.message,
    //         icon: '/notification-icon.png'
    //       });
    //     }
    //   });
    });

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      // Attempt reconnect after 5 seconds
      setTimeout(() => {
        setIsConnected(true);
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  return { notifications, unreadCount, markAsRead, isConnected };
}
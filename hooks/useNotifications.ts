// hooks/useNotifications.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { notificationTypes, typenotifications } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
type notificationTypes = {
  
    user_id: number;
    type_id: number;
    title: string;
    message: string;
    id?: number | undefined;
    data?: unknown;
    created_at?: string | undefined;
    redirect_url?: string | null | undefined;
    read_at?: Date | null;
}
export function useNotifications(userId: number) {
  const [notifications, setNotifications] = useState<notificationTypes[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
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
              router.refresh()

    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

 useEffect(() => {
  if (!userId) return;

  let eventSource: EventSource | null = null;
  let reconnectTimer: NodeJS.Timeout;
  let refreshTimer: NodeJS.Timeout;

  const setupEventSource = () => {
    // Close existing connection if any
    if (eventSource) {
      eventSource.close();
    }

    // Create new EventSource connection
    eventSource = new EventSource(`/api/notifications/stream`);

    eventSource.addEventListener('initial', (event) => {
      const data = JSON.parse(event.data) as Notification[];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read_at).length);
      setIsConnected(true);
      
      // Schedule refresh before Vercel's 5-minute limit (refresh at 4 minutes)
      refreshTimer = setTimeout(() => {
        setupEventSource(); // Create new connection before timeout
      }, 4 * 60 * 1000); // 4 minutes
    });

    eventSource.addEventListener('update', (event) => {
      const newNotifications = JSON.parse(event.data) as notificationTypes;
      const notificationArray = Array.isArray(newNotifications) ? newNotifications : [newNotifications];
      const filteredNotifications = notificationArray.filter(n => n.user_id === userId);
      
      setNotifications(prev => [...filteredNotifications, ...prev]);
      setUnreadCount(prev => prev + notificationArray.filter(n => !n.read_at).length);
    });

    eventSource.onerror = () => {
      setIsConnected(false);
      if (eventSource) eventSource.close();
      
      // Clear any pending refresh (since we're in error state)
      clearTimeout(refreshTimer);
      
      // Attempt reconnect after 5 seconds
      reconnectTimer = setTimeout(() => {
        setupEventSource();
      }, 5000);
    };
  };

  // Initial setup
  setupEventSource();

  return () => {
    // Cleanup on unmount
    if (eventSource) eventSource.close();
    clearTimeout(reconnectTimer);
    clearTimeout(refreshTimer);
  };
}, [userId]);
  return { notifications, unreadCount, markAsRead, isConnected };
}
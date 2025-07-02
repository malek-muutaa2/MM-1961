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
    let refreshTimer: NodeJS.Timeout;
    let reconnectTimer: NodeJS.Timeout;

    const cleanup = () => {
      if (eventSource) eventSource.close();
      clearTimeout(refreshTimer);
      clearTimeout(reconnectTimer);
    };

    const setup = () => {
      cleanup();
      eventSource = new EventSource('/api/notifications/stream');

      eventSource.addEventListener('open', () => {
        setIsConnected(true);
      });

      eventSource.addEventListener('initial', (event) => {
        const data = JSON.parse(event.data) as notificationTypes[];
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read_at).length);
        setIsConnected(true);

        // reconnect after 4 mins to avoid 5min timeout
      refreshTimer = setTimeout(setup, 4 * 60 * 1000);      });

      eventSource.addEventListener('update', (event) => {
        const payload = JSON.parse(event.data) as notificationTypes | notificationTypes[];
        const arr = Array.isArray(payload) ? payload : [payload];
        const filtered = arr.filter(n => n.user_id === userId);

        setNotifications(prev => [...filtered, ...prev]);
        setUnreadCount(prev => prev + arr.filter(n => !n.read_at).length);
              refreshTimer = setTimeout(setup, 4 * 60 * 1000);
      });

     eventSource.onerror = () => {
      setIsConnected(false);
      cleanup();
      reconnectTimer = setTimeout(setup, 4000);
    };
    // ...initial, update listeners...
    refreshTimer = setTimeout(setup, 4 * 60 * 1000);
  };

    setup();

    return () => {
      cleanup();
    };
  }, [userId]);
  return { notifications, unreadCount, markAsRead, isConnected };
}
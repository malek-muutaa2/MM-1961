// hooks/useNotifications.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { notificationTypes } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
type notificationTypes = {
  id: number;
    user_id: number;
    type_id: number;
    title: string;
    message: string;
    data?: unknown;
    created_at?: string ;
    redirect_url?: string | null;
    read_at?: Date | null;
}
function incrementUnreadCount(current: number, newItems: { read_at: Date | null | undefined }[]): number {
  return current + countUnreadNotifications(newItems);
}
function prependNotifications(
  existing: notificationTypes[],
  incoming: notificationTypes[]
): notificationTypes[] {
  return [...incoming, ...existing];
}


function normalizeNotifications(
  data: notificationTypes | notificationTypes[]
): notificationTypes[] {
  return Array.isArray(data) ? data : [data];
}

function filterByUser<T extends { user_id: number }>(
  items: T[],
  userId: number
): T[] {
  return items.filter(item => item.user_id === userId);
}

function countUnread(items: notificationTypes[]): number {
  return items.filter(item => !item.read_at).length;
}
function countUnreadNotifications(notifications: { read_at: Date | null | undefined }[]): number {
  return notifications.filter(n => !n.read_at).length;
}

export function useNotifications(userId: number) { // NOSONAR
  const [notifications, setNotifications] = useState<notificationTypes[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
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
        const data: any = JSON.parse(event.data) as notificationTypes[];
        setNotifications(data);
      setUnreadCount(countUnreadNotifications(data));

        setIsConnected(true);

        // reconnect after 4 mins to avoid 5min timeout
      refreshTimer = setTimeout(setup, 4 * 60 * 1000);      });

     eventSource.addEventListener('update', (event) => {
  const payload = JSON.parse(event.data) as notificationTypes | notificationTypes[];
  const all = normalizeNotifications(payload);
  const filtered: any = filterByUser(all, userId);

setNotifications(prev => prependNotifications(prev, filtered)); //NOSONAR
setUnreadCount((prev: any) => {//NOSONAR
    incrementUnreadCount(prev, filtered)
    return prev;
});
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

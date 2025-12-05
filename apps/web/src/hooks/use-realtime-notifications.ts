'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';

export interface Notification {
  id: string;
  type: 'alert' | 'message' | 'payment' | 'health' | 'attendance' | 'system';
  title: string;
  message: string;
  priority: 'urgent' | 'important' | 'normal';
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

interface UseRealtimeNotificationsOptions {
  pollingInterval?: number;
  enableSound?: boolean;
  enableDesktopNotifications?: boolean;
}

interface UseRealtimeNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  refetch: () => Promise<void>;
}

// Sound for notifications
const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {
    // Silently fail if audio doesn't work
  }
};

// Request desktop notification permission
const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Show desktop notification
const showDesktopNotification = (notification: Notification) => {
  if (Notification.permission !== 'granted') return;
  
  const icon = notification.priority === 'urgent' 
    ? '/icons/notification-urgent.png' 
    : '/icons/notification.png';
  
  new Notification(notification.title, {
    body: notification.message,
    icon,
    tag: notification.id,
    requireInteraction: notification.priority === 'urgent',
  });
};

export function useRealtimeNotifications(
  options: UseRealtimeNotificationsOptions = {}
): UseRealtimeNotificationsReturn {
  const {
    pollingInterval = 30000, // 30 seconds default
    enableSound = true,
    enableDesktopNotifications = true,
  } = options;

  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const previousCountRef = useRef(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (status !== 'authenticated') return;

    try {
      // In a real app, this would call your API
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      
      // Simulated API response
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'attendance',
          title: 'Arrivée confirmée',
          message: 'Emma Dupont est arrivée à 08:15',
          priority: 'normal',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'health',
          title: 'Alerte santé',
          message: 'Lucas Martin a de la fièvre (38.5°C)',
          priority: 'urgent',
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'payment',
          title: 'Paiement reçu',
          message: 'Paiement de 892.50$ reçu pour la facture KIDV-2024-001234',
          priority: 'normal',
          read: true,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          type: 'message',
          title: 'Nouveau message',
          message: 'Marie Dupont vous a envoyé un message',
          priority: 'important',
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setNotifications(mockNotifications);
      setIsConnected(true);

      // Check for new notifications
      const currentUnreadCount = mockNotifications.filter(n => !n.read).length;
      if (currentUnreadCount > previousCountRef.current) {
        const newNotifications = mockNotifications.filter(
          n => !n.read && n.priority !== 'normal'
        );
        
        if (newNotifications.length > 0) {
          const newest = newNotifications[0];
          
          if (enableSound) {
            playNotificationSound();
          }
          
          if (enableDesktopNotifications) {
            showDesktopNotification(newest);
          }
        }
      }
      previousCountRef.current = currentUnreadCount;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setIsConnected(false);
    }
  }, [status, enableSound, enableDesktopNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    // In real app: await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // In real app: await fetch('/api/notifications/read-all', { method: 'PUT' });
  }, []);

  // Delete a notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    // In real app: await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    // In real app: await fetch('/api/notifications', { method: 'DELETE' });
  }, []);

  // Initial fetch and setup polling
  useEffect(() => {
    if (status !== 'authenticated') return;

    // Request desktop notification permission
    if (enableDesktopNotifications) {
      requestNotificationPermission();
    }

    // Initial fetch
    fetchNotifications();

    // Setup polling
    pollingRef.current = setInterval(fetchNotifications, pollingInterval);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [status, pollingInterval, enableDesktopNotifications, fetchNotifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refetch: fetchNotifications,
  };
}

// WebSocket version for real real-time (future implementation)
export function useWebSocketNotifications(): UseRealtimeNotificationsReturn {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    // Connect to WebSocket server
    // En production: wss://kidverse.app/ws
    // En développement: ws://localhost:4000/ws
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 
      (typeof window !== 'undefined' && window.location.protocol === 'https:' 
        ? `wss://${window.location.host}/ws`
        : 'ws://localhost:4000/ws');
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      // Authenticate the WebSocket connection
      ws.send(JSON.stringify({
        type: 'auth',
        token: (session as any)?.accessToken,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'notification') {
          setNotifications(prev => [message.data, ...prev]);
          
          // Play sound for important notifications
          if (message.data.priority !== 'normal') {
            playNotificationSound();
            showDesktopNotification(message.data);
          }
        }
        
        if (message.type === 'notifications_list') {
          setNotifications(message.data);
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        // Reconnection logic would go here
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [status, session]);

  const markAsRead = useCallback((id: string) => {
    wsRef.current?.send(JSON.stringify({ type: 'mark_read', id }));
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    wsRef.current?.send(JSON.stringify({ type: 'mark_all_read' }));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    wsRef.current?.send(JSON.stringify({ type: 'delete', id }));
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    wsRef.current?.send(JSON.stringify({ type: 'clear_all' }));
    setNotifications([]);
  }, []);

  const refetch = useCallback(async () => {
    wsRef.current?.send(JSON.stringify({ type: 'fetch_all' }));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    refetch,
  };
}


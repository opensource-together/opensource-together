import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import { notificationSocketService } from "../services/notification-socket.service";
import {
  getUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service";
import { useNotificationStore } from "../stores/notification.store";

export const useNotifications = () => {
  const { isAuthenticated, wsToken } = useAuth();
  const {
    notifications,
    isLoading: storeLoading,
    error: storeError,
    setNotifications,
    setError,
    addNotification,
    updateNotification,
  } = useNotificationStore();

  const [wsConnected, setWsConnected] = useState(false);

  const {
    data: unreadNotificationsData,
    isLoading: isLoadingUnread,
    error: unreadError,
  } = useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadNotifications,
    enabled: isAuthenticated,
  });

  // Effect to handle API notification data and merge with existing notifications
  useEffect(() => {
    if (unreadNotificationsData?.success) {
      const { notifications: existingNotifications } =
        useNotificationStore.getState();

      // Map existing notifications by ID to avoid duplicates
      const existingMap = new Map(existingNotifications.map((n) => [n.id, n]));

      // Add new notifications from API if not already present
      unreadNotificationsData.data.forEach((apiNotification) => {
        if (!existingMap.has(apiNotification.id)) {
          existingMap.set(apiNotification.id, apiNotification);
        }
      });

      // Update the store with the merged notifications
      setNotifications(Array.from(existingMap.values()));
    }
  }, [unreadNotificationsData, setNotifications]);

  // Effect to handle errors from the API
  useEffect(() => {
    if (unreadError) {
      setError(
        unreadError instanceof Error
          ? unreadError.message
          : "Error loading notifications"
      );
    }
  }, [unreadError, setError]);

  // Effect to manage WebSocket connection and real-time notifications
  useEffect(() => {
    if (!wsToken) {
      setWsConnected(false);
      return;
    }

    notificationSocketService.startListening(wsToken);
    setWsConnected(true);

    // Subscribe to real-time notifications
    const unsubscribe = notificationSocketService.subscribe((notification) => {
      const exists = notifications.find((n) => n.id === notification.id);
      if (exists) {
        updateNotification(notification);
      } else {
        addNotification(notification);
      }
    });

    // Cleanup on unmount or token change
    return () => {
      unsubscribe();
      notificationSocketService.stopListening();
      setWsConnected(false);
    };
  }, [wsToken, addNotification, updateNotification, notifications]);

  const markAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const markAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const isLoading = storeLoading || isLoadingUnread;
  const error = storeError || unreadError;

  return {
    // State
    notifications,
    unreadCount: useNotificationStore.getState().unreadCount,
    isLoading,
    error,
    wsConnected,

    // Actions
    markAsRead,
    markAllAsRead,
  };
};

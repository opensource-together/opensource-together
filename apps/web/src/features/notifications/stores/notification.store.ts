import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Notification } from "../types/notification.type";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (notification: Notification) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setNotifications: (notifications) => {
        const unreadCount = notifications.filter((n) => !n.readAt).length;
        set({ notifications, unreadCount });
      },

      addNotification: (notification) => {
        const { notifications, unreadCount } = get();

        const notificationExists = notifications.some(
          (n) => n.id === notification.id
        );
        if (notificationExists) return;

        const newNotifications = [notification, ...notifications];
        const newUnreadCount = notification.readAt
          ? unreadCount
          : unreadCount + 1;
        set({
          notifications: newNotifications,
          unreadCount: newUnreadCount,
        });
      },

      updateNotification: (updatedNotification) => {
        const { notifications } = get();
        const updatedNotifications = notifications.map((n) =>
          n.id === updatedNotification.id ? updatedNotification : n
        );

        const newUnreadCount = updatedNotifications.filter(
          (n) => !n.readAt
        ).length;

        set({
          notifications: updatedNotifications,
          unreadCount: newUnreadCount,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: "notification-store",
    }
  )
);

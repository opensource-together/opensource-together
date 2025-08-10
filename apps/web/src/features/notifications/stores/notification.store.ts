import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Notification } from "../types/notification.type";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isOpen: false,
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
        const newNotifications = [notification, ...notifications];
        const newUnreadCount = notification.readAt
          ? unreadCount
          : unreadCount + 1;
        set({
          notifications: newNotifications,
          unreadCount: newUnreadCount,
        });
      },

      markAsRead: (notificationId) => {
        const { notifications, unreadCount } = get();
        const updatedNotifications = notifications.map((n) =>
          n.id === notificationId
            ? { ...n, readAt: new Date().toISOString() }
            : n
        );
        const newUnreadCount = Math.max(0, unreadCount - 1);
        set({
          notifications: updatedNotifications,
          unreadCount: newUnreadCount,
        });
      },

      markAllAsRead: () => {
        const { notifications } = get();
        const updatedNotifications = notifications.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        }));
        set({
          notifications: updatedNotifications,
          unreadCount: 0,
        });
      },

      setUnreadCount: (count) => set({ unreadCount: count }),

      incrementUnreadCount: () => {
        const { unreadCount } = get();
        set({ unreadCount: unreadCount + 1 });
      },

      decrementUnreadCount: () => {
        const { unreadCount } = get();
        set({ unreadCount: Math.max(0, unreadCount - 1) });
      },

      setIsOpen: (isOpen) => set({ isOpen }),

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

import { socket } from "@/shared/realtime/socket";

import { Notification } from "../types/notification.type";

class NotificationSocketService {
  private listeners: Set<(notification: Notification) => void> = new Set();
  private isListening = false;

  startListening(token?: string) {
    if (this.isListening) return;

    this.isListening = true;

    if (token) {
      socket.connect(token);
    }

    socket.on("new-notification", (message: any) => {
      if (message.id && message.type) {
        const notification = {
          ...message,
          createdAt: new Date(message.createdAt),
          readAt: message.readAt ? new Date(message.readAt) : null,
        };

        this.notifyListeners(notification);
      }
    });

    socket.on("unread-notifications", (notifications: any[]) => {
      notifications.forEach((notification) => {
        const formattedNotification = {
          ...notification,
          createdAt: new Date(notification.createdAt),
          readAt: notification.readAt ? new Date(notification.readAt) : null,
        };
        this.notifyListeners(formattedNotification);
      });
    });
  }

  stopListening() {
    if (!this.isListening) return;

    this.isListening = false;
  }

  subscribe(callback: (notification: Notification) => void): () => void {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(notification: Notification) {
    this.listeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("Erreur dans le callback de notification:", error);
      }
    });
  }

  isConnected() {
    return socket.isConnected();
  }
}

export const notificationSocketService = new NotificationSocketService();

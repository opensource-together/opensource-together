import { socket } from "@/shared/realtime/socket";

import { NotificationType } from "../types/notification.type";

class NotificationSocketService {
  private listeners: Set<(notification: NotificationType) => void> = new Set();
  private isListening = false;

  startListening(token?: string) {
    if (this.isListening) return;

    this.isListening = true;

    if (token) {
      socket.connect(token);
    }

    socket.on("new-notification", (message: NotificationType) => {
      if (message.id && message.type) {
        const notification = message;
        this.notifyListeners(notification);
      }
    });

    socket.on("unread-notifications", (notifications: NotificationType[]) => {
      notifications.forEach((notification) => {
        const formattedNotification = notification;
        this.notifyListeners(formattedNotification);
      });
    });

    socket.on("notification-read", (message: NotificationType) => {
      if (message.id && message.type) {
        const updatedNotification = message;
        this.notifyListeners(updatedNotification);
      }
    });
  }

  stopListening() {
    if (!this.isListening) return;

    this.isListening = false;
  }

  subscribe(callback: (notification: NotificationType) => void): () => void {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(notification: NotificationType) {
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

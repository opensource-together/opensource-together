import { socket } from "@/shared/realtime/socket";

import { NotificationType } from "../types/notification.type";

/**
 * Notification socket service
 * @description Service responsible for managing real-time notifications via WebSocket.
 * Allows you to listen, broadcast and subscribe to server notifications.
 */
class NotificationSocketService {
  private listeners: Set<(notification: NotificationType) => void> = new Set();
  private isListening = false;

  /**
   * Start listening for notifications
   * @param token - The token to connect to the WebSocket
   */
  startListening(token?: string) {
    if (this.isListening) return;

    this.isListening = true;

    if (token) {
      socket.connect(token);
    }

    /**
     * Event triggered when a new notification is received.
     * @param message - The notification message
     */
    socket.on("new-notification", (message: NotificationType) => {
      if (message.id && message.type) {
        const notification = message;
        this.notifyListeners(notification);
      }
    });

    /**
     * Event triggered when unread notifications are received.
     * @param notifications - The unread notifications
     */
    socket.on("unread-notifications", (notifications: NotificationType[]) => {
      notifications.forEach((notification) => {
        const formattedNotification = notification;
        this.notifyListeners(formattedNotification);
      });
    });

    /**
     * Event triggered when a notification is read.
     * @param message - The notification message
     */
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

  /**
   * Subscribe to notifications
   * @param callback - The callback to handle the notification
   * @returns A function to unsubscribe from the notifications
   */
  subscribe(callback: (notification: NotificationType) => void): () => void {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify listeners of a notification
   * @param notification - The notification to notify listeners of
   */
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

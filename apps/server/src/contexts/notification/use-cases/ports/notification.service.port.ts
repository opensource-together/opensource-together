import { Result } from '@/libs/result';

export const NOTIFICATION_SERVICE_PORT = Symbol('NOTIFICATION_SERVICE_PORT');

export type NotificationChannel = 'realtime' | 'email';

export interface SendNotificationPayload {
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  channels?: NotificationChannel[];
}

export interface NotificationData {
  id: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  readAt: Date | null;
}

export interface NotificationServicePort {
  sendNotification(
    notification: SendNotificationPayload,
  ): Promise<Result<void, string>>;

  getUnreadNotifications(
    userId: string,
  ): Promise<Result<NotificationData[], string>>;

  markNotificationAsRead(notificationId: string): Promise<Result<void, string>>;

  markAllNotificationsAsRead(userId: string): Promise<Result<void, string>>;

  getNotificationById(
    notificationId: string,
  ): Promise<Result<NotificationData, string>>;
}

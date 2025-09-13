import { Result } from '@/libs/result';
import { NotificationData } from '../repositories/notification.repository.interface';

export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');

export type NotificationChannel = 'realtime' | 'email';

export interface SendNotificationPayload {
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  channels?: NotificationChannel[];
}

// Re-export NotificationData from repository
export type { NotificationData };

export interface NotificationServiceInterface {
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

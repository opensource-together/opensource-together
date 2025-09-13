import { Result } from '@/libs/result';

export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');

export interface CreateNotificationData {
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
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

export interface NotificationRepository {
  create(
    data: CreateNotificationData,
  ): Promise<Result<NotificationData, string>>;

  findUnreadByUserId(
    userId: string,
  ): Promise<Result<NotificationData[], string>>;

  findById(notificationId: string): Promise<Result<NotificationData, string>>;

  markAsRead(notificationId: string): Promise<Result<NotificationData, string>>;

  markAllAsReadByUserId(
    userId: string,
  ): Promise<Result<NotificationData[], string>>;
}

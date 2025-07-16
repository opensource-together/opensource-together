import { Result } from '@/libs/result';

export const NOTIFICATION_SERVICE_PORT = Symbol('NotificationService');

export type NotificationChannel = 'realtime' | 'email';

export interface SendNotificationPayload {
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  channels?: NotificationChannel[];
}

export interface NotificationServicePort {
  sendNotification(
    notification: SendNotificationPayload,
  ): Promise<Result<void, string>>;
}

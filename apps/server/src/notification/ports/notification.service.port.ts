import { Result } from '@/libs/result';

export const NOTIFICATION_SERVICE_PORT = Symbol('NotificationService');

export type NotificationChannel = 'realtime' | 'email';

export interface NotificationServicePort {
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  channels?: NotificationChannel[];
}

export interface NotificationServicePort {
  sendNotification(
    notification: NotificationServicePort,
  ): Promise<Result<void, string>>;
}

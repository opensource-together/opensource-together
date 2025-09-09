import { NotificationData } from './notification.service.interface';

export const NOTIFICATION_GATEWAY = Symbol('NOTIFICATION_GATEWAY');

export interface NotificationGatewayInterface {
  sendNotificationToUser(
    notification: NotificationData,
  ): Promise<string | null>;

  sendNotificationUpdate(
    notification: NotificationData,
  ): Promise<string | null>;
}


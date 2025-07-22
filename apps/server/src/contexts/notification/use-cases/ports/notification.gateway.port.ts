import { NotificationData } from './notification.service.port';

export const NOTIFICATION_GATEWAY_PORT = Symbol('NOTIFICATION_GATEWAY_PORT');

export interface NotificationGatewayPort {
  sendNotificationToUser(notification: NotificationData): void;
  sendNotificationUpdate(notification: NotificationData): void;
}

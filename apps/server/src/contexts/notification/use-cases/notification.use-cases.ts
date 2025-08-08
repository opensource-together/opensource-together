import { CreateNotificationCommandHandler } from './commands/create-notification.command';
import { MarkNotificationReadCommandHandler } from './commands/mark-notification-read.command';
import { MarkAllNotificationsReadCommandHandler } from './commands/mark-all-notifications-read.command';
import { GetUnreadNotificationsQueryHandler } from './queries/get-unread-notifications.query';

export const notificationUseCases = [
  // Command Handlers
  CreateNotificationCommandHandler,
  MarkNotificationReadCommandHandler,
  MarkAllNotificationsReadCommandHandler,

  // Query Handlers
  GetUnreadNotificationsQueryHandler,
];

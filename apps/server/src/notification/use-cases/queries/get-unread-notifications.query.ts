import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  NotificationData,
} from '../ports/notification.service.port';

/**
 * Query pour récupérer les notifications non lues d'un utilisateur.
 */
export class GetUnreadNotificationsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

/**
 * Handler pour récupérer les notifications non lues.
 */
@QueryHandler(GetUnreadNotificationsQuery)
export class GetUnreadNotificationsQueryHandler
  implements IQueryHandler<GetUnreadNotificationsQuery>
{
  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
  ) {}

  async execute(
    query: GetUnreadNotificationsQuery,
  ): Promise<Result<NotificationData[], string>> {
    return this.notificationService.getUnreadNotifications(query.userId);
  }
}

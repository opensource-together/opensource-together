import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
} from '../ports/notification.service.port';
import { Notification } from '../../domain/notification.entity';

export class GetUnreadNotificationsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

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
  ): Promise<Result<Notification[], string>> {
    // 1. Récupérer les données brutes depuis le service
    const result = await this.notificationService.getUnreadNotifications(
      query.userId,
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    // 2. Transformer les données brutes en entités du domaine
    const notificationEntities = result.value.map((data) =>
      Notification.reconstitute({
        id: data.id,
        receiverId: data.receiverId,
        senderId: data.senderId,
        type: data.type,
        payload: data.payload,
        createdAt: data.createdAt,
        readAt: data.readAt,
      }),
    );

    // 3. Vérifier que toutes les reconstitutions ont réussi
    const failedReconstitution = notificationEntities.find((n) => !n.success);
    if (failedReconstitution) {
      return Result.fail(
        `Failed to reconstitute notification: ${failedReconstitution.error}`,
      );
    }

    // 4. Retourner les entités validées
    const validNotifications = notificationEntities
      .filter((n) => n.success)
      .map((n) => n.value);

    return Result.ok(validNotifications);
  }
}

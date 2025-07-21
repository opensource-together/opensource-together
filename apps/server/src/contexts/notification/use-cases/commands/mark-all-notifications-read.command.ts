import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
} from '../ports/notification.service.port';
import { Notification } from '../../domain/notification.entity';

/**
 * Commande pour marquer toutes les notifications d'un utilisateur comme lues.
 */
export class MarkAllNotificationsReadCommand implements ICommand {
  constructor(public readonly ownerId: string) {}
}

/**
 * Handler pour marquer toutes les notifications d'un utilisateur comme lues.
 */
@CommandHandler(MarkAllNotificationsReadCommand)
export class MarkAllNotificationsReadCommandHandler
  implements ICommandHandler<MarkAllNotificationsReadCommand>
{
  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
  ) {}

  async execute(
    command: MarkAllNotificationsReadCommand,
  ): Promise<Result<void, string>> {
    // 1. Récupérer les notifications non lues
    const result = await this.notificationService.getUnreadNotifications(
      command.ownerId,
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    if (
      result.value.some(
        (notification) => notification.userId !== command.ownerId,
      )
    ) {
      return Result.fail('You are not the owner of this notification');
    }

    // 2. Reconstituer les entités et les marquer comme lues
    const notificationEntities = result.value.map((data) =>
      Notification.reconstitute({
        id: data.id,
        userId: data.userId,
        type: data.type,
        payload: data.payload,
        createdAt: data.createdAt,
        readAt: data.readAt,
      }),
    );

    // Vérifier les reconstitutions
    const failedReconstitution = notificationEntities.find((n) => !n.success);
    if (failedReconstitution) {
      return Result.fail(
        `Failed to reconstitute notification: ${failedReconstitution.error}`,
      );
    }

    // Marquer toutes comme lues
    notificationEntities
      .filter((n) => n.success)
      .forEach((n) => n.value.markAsRead());

    // 3. Persister les changements
    return await this.notificationService.markAllNotificationsAsRead(
      command.ownerId,
    );
  }
}

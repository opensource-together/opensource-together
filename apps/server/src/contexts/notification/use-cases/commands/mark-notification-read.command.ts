import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
} from '../ports/notification.service.port';
import { Notification } from '../../domain/notification.entity';

/**
 * Commande pour marquer une notification comme lue.
 */
export class MarkNotificationReadCommand implements ICommand {
  constructor(
    public readonly notificationId: string,
    public readonly ownerId: string,
  ) {}
}

/**
 * Handler pour marquer une notification comme lue.
 */
@CommandHandler(MarkNotificationReadCommand)
export class MarkNotificationReadCommandHandler
  implements ICommandHandler<MarkNotificationReadCommand>
{
  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
  ) {}

  async execute(
    command: MarkNotificationReadCommand,
  ): Promise<Result<void, string>> {
    // 1. Récupérer la notification
    const result = await this.notificationService.getNotificationById(
      command.notificationId,
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    if (command.ownerId !== result.value.receiverId) {
      return Result.fail('You are not the owner of this notification');
    }

    // 2. Reconstituer l'entité
    const notificationEntity = Notification.reconstitute({
      id: result.value.id,
      receiverId: result.value.receiverId,
      senderId: result.value.senderId,
      type: result.value.type,
      payload: result.value.payload,
      createdAt: result.value.createdAt,
      readAt: result.value.readAt,
    });

    if (!notificationEntity.success) {
      return Result.fail(
        `Failed to reconstitute notification: ${notificationEntity.error}`,
      );
    }

    // 3. Vérifier si déjà lue
    if (notificationEntity.value.isRead()) {
      return Result.fail('Notification is already marked as read');
    }

    // 4. Marquer comme lue
    notificationEntity.value.markAsRead();

    // 5. Persister
    return await this.notificationService.markNotificationAsRead(
      command.notificationId,
    );
  }
}

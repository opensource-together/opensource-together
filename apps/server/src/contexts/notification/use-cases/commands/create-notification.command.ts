import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  SendNotificationPayload,
} from '../ports/notification.service.port';
import { Notification } from '../../domain/notification.entity';

/**
 * Command pour créer et envoyer une notification.
 */
export class CreateNotificationCommand implements ICommand {
  constructor(public readonly payload: SendNotificationPayload) {}
}

/**
 * Handler pour créer et envoyer une notification.
 * Valide les données avec l'entité du domaine puis délègue au service.
 */
@CommandHandler(CreateNotificationCommand)
export class CreateNotificationCommandHandler
  implements ICommandHandler<CreateNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
  ) {}

  async execute(
    command: CreateNotificationCommand,
  ): Promise<Result<void, string>> {
    console.log('CreateNotificationCommandHandler');
    console.log('command', command);
    // 1. Valider les données avec l'entité du domaine
    const notificationEntity = Notification.create({
      userId: command.payload.userId,
      type: command.payload.type,
      payload: command.payload.payload,
    });

    if (!notificationEntity.success) {
      return Result.fail(`Validation failed: ${notificationEntity.error}`);
    }

    // 2. Si la validation réussit, déléguer au service d'infrastructure
    return await this.notificationService.sendNotification(command.payload);
  }
}

import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  SendNotificationPayload,
} from '../../ports/notification.service.port';

/**
 * Commande transportant le payload.
 */
export class CreateNotificationCommand implements ICommand {
  constructor(public readonly payload: SendNotificationPayload) {}
}

/**
 * Handler : délègue au service applicatif.
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
    return this.notificationService.sendNotification(command.payload);
  }
}

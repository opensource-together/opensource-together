import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
} from '../ports/notification.service.port';

/**
 * Commande pour marquer une notification comme lue.
 */
export class MarkNotificationReadCommand implements ICommand {
  constructor(public readonly notificationId: string) {}
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
    return this.notificationService.markNotificationAsRead(
      command.notificationId,
    );
  }
}

import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
} from '../ports/notification.service.port';

/**
 * Commande pour marquer toutes les notifications d'un utilisateur comme lues.
 */
export class MarkAllNotificationsReadCommand implements ICommand {
  constructor(public readonly userId: string) {}
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
    return this.notificationService.markAllNotificationsAsRead(command.userId);
  }
}

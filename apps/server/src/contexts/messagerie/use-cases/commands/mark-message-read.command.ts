import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MESSAGE_SERVICE_PORT,
  MessageServicePort,
  MarkMessageAsReadPayload,
} from '../ports/message.service.port';

export class MarkMessageAsReadCommand implements ICommand {
  constructor(public readonly payload: MarkMessageAsReadPayload) {}
}

@CommandHandler(MarkMessageAsReadCommand)
export class MarkMessageAsReadCommandHandler
  implements ICommandHandler<MarkMessageAsReadCommand>
{
  constructor(
    @Inject(MESSAGE_SERVICE_PORT)
    private readonly messageService: MessageServicePort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: MarkMessageAsReadCommand,
  ): Promise<Result<void, string>> {
    const { payload } = command;

    try {
      // 1. Récupérer le message pour vérifier qu'il existe et obtenir la roomId
      const messageResult = await this.messageService.getMessageById(
        payload.messageId,
      );

      if (!messageResult.success) {
        return Result.fail(messageResult.error);
      }

      if (!messageResult.value) {
        return Result.fail('Message not found');
      }

      const message = messageResult.value;

      // 2. Vérifier que l'utilisateur peut accéder à la room
      const canAccess = await this.messageService.canUserAccessRoom(
        message.roomId,
        payload.userId,
      );

      if (!canAccess.success) {
        return Result.fail(`Access check failed: ${canAccess.error}`);
      }

      if (!canAccess.value) {
        return Result.fail('User does not have access to this room');
      }

      // 3. Marquer le message comme lu
      const markReadResult =
        await this.messageService.markMessageAsRead(payload);

      if (!markReadResult.success) {
        return Result.fail(markReadResult.error);
      }

      // 4. Émettre un événement pour notifier les autres participants
      this.eventEmitter.emit('message.read', {
        messageId: payload.messageId,
        roomId: message.roomId,
        userId: payload.userId,
        readAt: new Date(),
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(`Failed to mark message as read: ${error.message}`);
    }
  }
}

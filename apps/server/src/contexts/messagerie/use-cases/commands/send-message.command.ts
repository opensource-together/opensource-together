import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MESSAGE_SERVICE_PORT,
  MessageServicePort,
  SendMessagePayload,
} from '../ports/message.service.port';
import { MessageData, MessageType } from '../../domain/message.entity';

export class SendMessageCommand implements ICommand {
  constructor(public readonly payload: SendMessagePayload) {}
}

@CommandHandler(SendMessageCommand)
export class SendMessageCommandHandler
  implements ICommandHandler<SendMessageCommand>
{
  constructor(
    @Inject(MESSAGE_SERVICE_PORT)
    private readonly messageService: MessageServicePort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    command: SendMessageCommand,
  ): Promise<Result<MessageData, string>> {
    const { payload } = command;

    try {
      // 1. Vérifier que l'utilisateur peut accéder à la room
      const canAccess = await this.messageService.canUserAccessRoom(
        payload.roomId,
        payload.senderId,
      );

      if (!canAccess.success) {
        return Result.fail(`Access check failed: ${canAccess.error}`);
      }

      if (!canAccess.value) {
        return Result.fail('User does not have access to this room');
      }

      // 2. Envoyer le message via le service
      const messageResult = await this.messageService.sendMessage(payload);

      if (!messageResult.success) {
        return Result.fail(messageResult.error);
      }

      const message = messageResult.value;

      // 3. Émettre un événement pour déclencher les notifications temps réel
      this.eventEmitter.emit('message.sent', {
        messageId: message.id,
        roomId: message.roomId,
        senderId: message.senderId,
        content: message.content,
        messageType: message.messageType,
        createdAt: message.createdAt,
        replyToId: message.replyToId,
      });

      // 4. Émettre un événement pour la room (mise à jour lastMessageAt)
      this.eventEmitter.emit('room.message.added', {
        roomId: message.roomId,
        messageId: message.id,
        senderId: message.senderId,
      });

      return Result.ok(message);
    } catch (error) {
      return Result.fail(`Failed to send message: ${error.message}`);
    }
  }
}

import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  MESSAGE_SERVICE_PORT,
  MessageServicePort,
  GetMessagesPayload,
} from '../ports/message.service.port';
import { Message } from '../../domain/message.entity';

export class GetMessagesQuery implements IQuery {
  constructor(public readonly payload: GetMessagesPayload) {}
}

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery>
{
  constructor(
    @Inject(MESSAGE_SERVICE_PORT)
    private readonly messageService: MessageServicePort,
  ) {}

  async execute(query: GetMessagesQuery): Promise<Result<Message[], string>> {
    const { payload } = query;

    try {
      // 1. Vérifier que l'utilisateur peut accéder à la room
      const canAccess = await this.messageService.canUserAccessRoom(
        payload.roomId,
        payload.userId,
      );

      if (!canAccess.success) {
        return Result.fail(`Access check failed: ${canAccess.error}`);
      }

      if (!canAccess.value) {
        return Result.fail('User does not have access to this room');
      }

      // 2. Récupérer les messages de la room
      const messagesResult = await this.messageService.getMessages(payload);

      if (!messagesResult.success) {
        return Result.fail(messagesResult.error);
      }

      // 3. Reconstituer les entités domain
      const messages = messagesResult.value.map((messageData) =>
        Message.reconstitute(messageData),
      );

      const validMessages = messages
        .filter((m) => m.success)
        .map((m) => m.value);

      return Result.ok(validMessages);
    } catch (error) {
      return Result.fail(
        `Failed to get messages: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

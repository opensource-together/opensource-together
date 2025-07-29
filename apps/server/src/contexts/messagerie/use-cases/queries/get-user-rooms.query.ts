import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import {
  MESSAGE_SERVICE_PORT,
  MessageServicePort,
  GetUserRoomsPayload,
} from '../ports/message.service.port';
import { Room } from '../../domain/room.entity';

export class GetUserRoomsQuery implements IQuery {
  constructor(public readonly payload: GetUserRoomsPayload) {}
}

@QueryHandler(GetUserRoomsQuery)
export class GetUserRoomsQueryHandler
  implements IQueryHandler<GetUserRoomsQuery>
{
  constructor(
    @Inject(MESSAGE_SERVICE_PORT)
    private readonly messageService: MessageServicePort,
  ) {}

  async execute(query: GetUserRoomsQuery): Promise<Result<Room[], string>> {
    const { payload } = query;

    try {
      // 1. Récupérer les rooms de l'utilisateur
      const roomsResult = await this.messageService.getUserRooms(payload);

      if (!roomsResult.success) {
        return Result.fail(roomsResult.error);
      }

      // 2. Reconstituer les entités domain
      const rooms = roomsResult.value.map((roomData) =>
        Room.reconstitute(roomData),
      );

      const validRooms = rooms.filter((r) => r.success).map((r) => r.value);

      return Result.ok(validRooms);
    } catch (error) {
      return Result.fail(
        `Failed to get user rooms: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

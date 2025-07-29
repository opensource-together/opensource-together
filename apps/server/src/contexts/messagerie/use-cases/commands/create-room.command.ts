import { ICommand, ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Result } from '@/libs/result';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MESSAGE_SERVICE_PORT,
  MessageServicePort,
  CreateRoomPayload,
} from '../ports/message.service.port';
import { RoomData } from '../../domain/room.entity';

export class CreateRoomCommand implements ICommand {
  constructor(public readonly payload: CreateRoomPayload) {}
}

@CommandHandler(CreateRoomCommand)
export class CreateRoomCommandHandler
  implements ICommandHandler<CreateRoomCommand>
{
  constructor(
    @Inject(MESSAGE_SERVICE_PORT)
    private readonly messageService: MessageServicePort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateRoomCommand): Promise<Result<RoomData, string>> {
    const { payload } = command;

    try {
      // 1. Créer la room
      const roomResult = await this.messageService.createRoom(payload);

      if (!roomResult.success) {
        return Result.fail(roomResult.error);
      }

      const room = roomResult.value;

      // 2. Émettre un événement pour notifier la création de room
      this.eventEmitter.emit('room.created', {
        roomId: room.id,
        participants: room.participants,
        roomType: room.roomType,
        name: room.name,
        createdAt: room.createdAt,
      });

      return Result.ok(room);
    } catch (error) {
      return Result.fail(
        `Failed to create room: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { Result } from '@/libs/result';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import {
  MessageServicePort,
  SendMessagePayload,
  GetMessagesPayload,
  CreateRoomPayload,
  MarkMessageAsReadPayload,
  GetUserRoomsPayload,
} from '../../use-cases/ports/message.service.port';
import { MessageData, Message, MessageType } from '../../domain/message.entity';
import { RoomData, Room, RoomType } from '../../domain/room.entity';
import { MessageTypeConverter } from '../converters/message-type.converter';
import { RoomTypeConverter } from '../converters/room-type.converter';

@Injectable()
export class MessageService implements MessageServicePort {
  constructor(private readonly prisma: PrismaService) {}

  async sendMessage(
    payload: SendMessagePayload,
  ): Promise<Result<MessageData, string>> {
    try {
      // 1. Validation avec l'entité domain
      const messageResult = Message.create({
        roomId: payload.roomId,
        senderId: payload.senderId,
        content: payload.content,
        messageType: payload.messageType || MessageType.TEXT,
        replyToId: payload.replyToId,
      });

      if (!messageResult.success) {
        return Result.fail(messageResult.error);
      }

      // 2. Persister en base de données
      const savedMessage = await this.prisma.message.create({
        data: {
          roomId: payload.roomId,
          senderId: payload.senderId,
          content: payload.content,
          messageType: MessageTypeConverter.toPrisma(
            payload.messageType || MessageType.TEXT,
          ),
          replyToId: payload.replyToId || null,
        },
      });

      // 3. Mettre à jour lastMessageAt de la room
      await this.prisma.room.update({
        where: { id: payload.roomId },
        data: { lastMessageAt: savedMessage.createdAt },
      });

      // 4. Convertir en MessageData
      const messageData: MessageData = {
        id: savedMessage.id,
        roomId: savedMessage.roomId,
        senderId: savedMessage.senderId,
        content: savedMessage.content,
        messageType: MessageTypeConverter.toDomain(savedMessage.messageType),
        replyToId: savedMessage.replyToId,
        createdAt: savedMessage.createdAt,
        updatedAt: savedMessage.updatedAt,
        readBy: [], // Les statuts de lecture seront récupérés séparément si nécessaire
      };

      return Result.ok(messageData);
    } catch (error) {
      return Result.fail(
        `Failed to send message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getMessages(
    payload: GetMessagesPayload,
  ): Promise<Result<MessageData[], string>> {
    try {
      const messages = await this.prisma.message.findMany({
        where: { roomId: payload.roomId },
        orderBy: { createdAt: 'desc' },
        take: payload.limit || 50,
        skip: payload.offset || 0,
        include: {
          readBy: true, // Inclure les statuts de lecture
        },
      });

      const messageData: MessageData[] = messages.map((message) => ({
        id: message.id,
        roomId: message.roomId,
        senderId: message.senderId,
        content: message.content,
        messageType: MessageTypeConverter.toDomain(message.messageType),
        replyToId: message.replyToId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        readBy: message.readBy.map((read) => ({
          userId: read.userId,
          readAt: read.readAt,
        })),
      }));

      return Result.ok(messageData);
    } catch (error) {
      return Result.fail(
        `Failed to get messages: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getMessageById(
    messageId: string,
  ): Promise<Result<MessageData | null, string>> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
        include: { readBy: true },
      });

      if (!message) {
        return Result.ok(null);
      }

      const messageData: MessageData = {
        id: message.id,
        roomId: message.roomId,
        senderId: message.senderId,
        content: message.content,
        messageType: MessageTypeConverter.toDomain(message.messageType),
        replyToId: message.replyToId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        readBy: message.readBy.map((read) => ({
          userId: read.userId,
          readAt: read.readAt,
        })),
      };

      return Result.ok(messageData);
    } catch (error) {
      return Result.fail(
        `Failed to get message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async createRoom(
    payload: CreateRoomPayload,
  ): Promise<Result<RoomData, string>> {
    try {
      // 1. Validation avec l'entité domain
      const roomResult = Room.createDirectRoom({
        participants: payload.participants,
        name: payload.name,
      });

      if (!roomResult.success) {
        return Result.fail(roomResult.error);
      }

      // 2. Générer l'ID de la room directe
      const roomId = Room.generateDirectRoomId(payload.participants);

      // 3. Vérifier si la room existe déjà
      const existingRoom = await this.getDirectRoom(payload.participants);
      if (existingRoom.success && existingRoom.value) {
        return Result.fail('Room already exists between these participants');
      }

      // 4. Créer une nouvelle room
      const createdRoom = await this.prisma.room.create({
        data: {
          id: roomId,
          roomType: RoomTypeConverter.toPrisma(RoomType.DIRECT),
          name: payload.name || null,
          description: payload.description || null,
          isActive: true,
          participants: {
            create: payload.participants.map((userId) => ({
              userId,
              joinedAt: new Date(),
            })),
          },
        },
        include: { participants: true },
      });

      const roomData: RoomData = {
        id: createdRoom.id,
        participants: createdRoom.participants.map((p) => p.userId),
        roomType: RoomTypeConverter.toDomain(createdRoom.roomType),
        name: createdRoom.name,
        description: createdRoom.description,
        createdAt: createdRoom.createdAt,
        updatedAt: createdRoom.updatedAt,
        lastMessageAt: createdRoom.lastMessageAt,
        isActive: createdRoom.isActive,
      };

      return Result.ok(roomData);
    } catch (error) {
      return Result.fail(
        `Failed to create room: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getDirectRoom(
    participants: string[],
  ): Promise<Result<RoomData | null, string>> {
    try {
      // Générer l'ID de la room directe
      const roomId = Room.generateDirectRoomId(participants);

      // Chercher la room existante
      const existingRoom = await this.prisma.room.findUnique({
        where: { id: roomId },
        include: { participants: true },
      });

      if (!existingRoom) {
        return Result.ok(null);
      }

      const roomData: RoomData = {
        id: existingRoom.id,
        participants: existingRoom.participants.map((p) => p.userId),
        roomType: RoomTypeConverter.toDomain(existingRoom.roomType),
        name: existingRoom.name,
        description: existingRoom.description,
        createdAt: existingRoom.createdAt,
        updatedAt: existingRoom.updatedAt,
        lastMessageAt: existingRoom.lastMessageAt,
        isActive: existingRoom.isActive,
      };

      return Result.ok(roomData);
    } catch (error) {
      return Result.fail(
        `Failed to get direct room: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getUserRooms(
    payload: GetUserRoomsPayload,
  ): Promise<Result<RoomData[], string>> {
    try {
      const rooms = await this.prisma.room.findMany({
        where: {
          participants: {
            some: { userId: payload.userId },
          },
          isActive: true,
        },
        include: { participants: true },
        orderBy: { lastMessageAt: 'desc' },
        take: payload.limit || 20,
        skip: payload.offset || 0,
      });

      const roomData: RoomData[] = rooms.map((room) => ({
        id: room.id,
        participants: room.participants.map((p) => p.userId),
        roomType: RoomTypeConverter.toDomain(room.roomType),
        name: room.name,
        description: room.description,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        lastMessageAt: room.lastMessageAt,
        isActive: room.isActive,
      }));

      return Result.ok(roomData);
    } catch (error) {
      return Result.fail(
        `Failed to get user rooms: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getRoomById(
    roomId: string,
    userId: string,
  ): Promise<Result<RoomData | null, string>> {
    try {
      const room = await this.prisma.room.findFirst({
        where: {
          id: roomId,
          participants: {
            some: { userId },
          },
        },
        include: { participants: true },
      });

      if (!room) {
        return Result.ok(null);
      }

      const roomData: RoomData = {
        id: room.id,
        participants: room.participants.map((p) => p.userId),
        roomType: RoomTypeConverter.toDomain(room.roomType),
        name: room.name,
        description: room.description,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
        lastMessageAt: room.lastMessageAt,
        isActive: room.isActive,
      };

      return Result.ok(roomData);
    } catch (error) {
      return Result.fail(
        `Failed to get room: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async markMessageAsRead(
    payload: MarkMessageAsReadPayload,
  ): Promise<Result<void, string>> {
    try {
      // Utiliser upsert pour éviter les doublons
      await this.prisma.messageRead.upsert({
        where: {
          messageId_userId: {
            messageId: payload.messageId,
            userId: payload.userId,
          },
        },
        update: {
          readAt: new Date(),
        },
        create: {
          messageId: payload.messageId,
          userId: payload.userId,
          readAt: new Date(),
        },
      });

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        `Failed to mark message as read: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async markAllMessagesAsReadInRoom(
    roomId: string,
    userId: string,
  ): Promise<Result<void, string>> {
    try {
      // Récupérer tous les messages non lus de la room
      const unreadMessages = await this.prisma.message.findMany({
        where: {
          roomId,
          NOT: {
            readBy: {
              some: { userId },
            },
          },
        },
        select: { id: true },
      });

      // Marquer tous comme lus
      const readData = unreadMessages.map((message) => ({
        messageId: message.id,
        userId,
        readAt: new Date(),
      }));

      if (readData.length > 0) {
        await this.prisma.messageRead.createMany({
          data: readData,
          skipDuplicates: true,
        });
      }

      return Result.ok(undefined);
    } catch (error) {
      return Result.fail(
        `Failed to mark all messages as read: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async canUserAccessRoom(
    roomId: string,
    userId: string,
  ): Promise<Result<boolean, string>> {
    try {
      const room = await this.prisma.room.findFirst({
        where: {
          id: roomId,
          participants: {
            some: { userId },
          },
          isActive: true,
        },
      });

      return Result.ok(!!room);
    } catch (error) {
      return Result.fail(
        `Failed to check room access: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getUnreadMessagesCount(
    roomId: string,
    userId: string,
  ): Promise<Result<number, string>> {
    try {
      const count = await this.prisma.message.count({
        where: {
          roomId,
          NOT: {
            readBy: {
              some: { userId },
            },
          },
        },
      });

      return Result.ok(count);
    } catch (error) {
      return Result.fail(
        `Failed to get unread count: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

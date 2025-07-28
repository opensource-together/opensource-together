import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  Param,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Session } from 'supertokens-nestjs';
import {
  SendMessageRequestDto,
  CreateRoomRequestDto,
} from './dto/send-message-request.dto';
import { SendMessageCommand } from '../../use-cases/commands/send-message.command';
import { CreateRoomCommand } from '../../use-cases/commands/create-room.command';
import { MarkMessageAsReadCommand } from '../../use-cases/commands/mark-message-read.command';
import { GetMessagesQuery } from '../../use-cases/queries/get-messages.query';
import { GetUserRoomsQuery } from '../../use-cases/queries/get-user-rooms.query';

/**
 * 🎮 Controller REST pour la messagerie
 * Expose les APIs publiques pour l'interaction avec le système de messagerie
 */
@Controller('messaging')
export class MessagerieController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 📤 Envoyer un message dans une room
   * POST /messaging/send
   */
  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @Session('userId') senderId: string,
    @Body() dto: SendMessageRequestDto,
  ) {
    const command = await this.commandBus.execute(
      new SendMessageCommand({
        roomId: dto.roomId,
        senderId,
        content: dto.content,
      }),
    );

    this.eventEmitter.emit('message.sent', command);

    const result = {
      success: true,
      value: command,
    };

    if (!result.success) {
      return {
        success: false,
        message: 'Message non envoyé',
      };
    }

    return {
      success: true,
      message: 'Message envoyé avec succès',
      data: result.value,
    };
  }

  /**
   * 🏠 Créer une nouvelle room de messagerie
   * POST /messaging/rooms
   */
  @Post('rooms')
  @HttpCode(HttpStatus.CREATED)
  async createRoom(
    @Session('userId') userId: string,
    @Body() dto: CreateRoomRequestDto,
  ) {
    // Ajouter l'utilisateur actuel aux participants s'il n'y est pas
    if (!dto.participants.includes(userId)) {
      dto.participants.push(userId);
    }

    const command = new CreateRoomCommand({
      participants: dto.participants,
      name: dto.name,
      description: dto.description,
    });

    const result = await this.commandBus.execute(command);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: 'Room créée avec succès',
      data: result.value,
    };
  }

  /**
   * 📬 Récupérer les messages d'une room
   * GET /messaging/rooms/:roomId/messages
   */
  @Get('rooms/:roomId/messages')
  async getRoomMessages(
    @Session('userId') userId: string,
    @Param('roomId') roomId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('beforeMessageId') beforeMessageId?: string,
  ) {
    const query = new GetMessagesQuery({
      roomId,
      userId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
      beforeMessageId,
    });

    const result = await this.queryBus.execute(query);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
        data: [],
      };
    }

    const messages = result.value.map((message) => message.toPrimitive());

    return {
      success: true,
      data: messages,
      count: messages.length,
    };
  }

  /**
   * 🏠 Récupérer les rooms d'un utilisateur
   * GET /messaging/rooms
   */
  @Get('rooms')
  async getUserRooms(
    @Session('userId') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const query = new GetUserRoomsQuery({
      userId,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    const result = await this.queryBus.execute(query);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
        data: [],
      };
    }

    const rooms = result.value.map((room) => room.toPrimitive());

    return {
      success: true,
      data: rooms,
      count: rooms.length,
    };
  }

  /**
   * 🔍 Récupérer une room spécifique par son ID
   * GET /messaging/rooms/:roomId
   */
  @Get('rooms/:roomId')
  async getRoomById(
    @Session('userId') userId: string,
    @Param('roomId') roomId: string,
  ) {
    try {
      // TODO: Créer GetRoomByIdQuery pour respecter l'architecture CQRS
      // Pour l'instant, utiliser un appel direct temporaire
      return {
        success: false,
        message: 'Endpoint not yet implemented - need GetRoomByIdQuery',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get room',
      };
    }
  }

  /**
   * ✅ Marquer un message comme lu
   * PATCH /messaging/messages/:messageId/read
   */
  @Patch('messages/:messageId/read')
  async markMessageAsRead(
    @Session('userId') userId: string,
    @Param('messageId') messageId: string,
  ) {
    const command = new MarkMessageAsReadCommand({
      messageId,
      userId,
    });

    const result = await this.commandBus.execute(command);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: 'Message marqué comme lu',
    };
  }

  /**
   * 📊 Obtenir des statistiques d'une room
   * GET /messaging/rooms/:roomId/stats
   */
  @Get('rooms/:roomId/stats')
  async getRoomStats(
    @Session('userId') userId: string,
    @Param('roomId') roomId: string,
  ) {
    try {
      // TODO: Implémenter via un service dédié
      return {
        success: true,
        data: {
          roomId,
          totalMessages: 0,
          unreadCount: 0,
          connectedUsers: [],
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de récupérer les statistiques',
      };
    }
  }

  /**
   * 🔍 Rechercher des messages dans une room
   * GET /messaging/rooms/:roomId/search
   */
  @Get('rooms/:roomId/search')
  async searchMessages(
    @Session('userId') userId: string,
    @Param('roomId') roomId: string,
    @Query('query') searchQuery?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      if (!searchQuery || searchQuery.trim() === '') {
        return {
          success: false,
          message: 'Query de recherche requise',
          data: [],
        };
      }

      // TODO: Implémenter la recherche via le service
      return {
        success: true,
        data: [],
        query: searchQuery,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la recherche',
        data: [],
      };
    }
  }
}

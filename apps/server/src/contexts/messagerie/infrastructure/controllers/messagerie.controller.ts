import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Session } from 'supertokens-nestjs';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { CreateRoomRequestDto } from './dto/send-message-request.dto';
import { SendMessageCommand } from '../../use-cases/commands/send-message.command';
import { CreateRoomCommand } from '../../use-cases/commands/create-room.command';
import { GetMessagesQuery } from '../../use-cases/queries/get-messages.query';
import { GetUserRoomsQuery } from '../../use-cases/queries/get-user-rooms.query';
import { Result } from '@/libs/result';
import { Room } from '@/contexts/messagerie/domain/room.entity';
import { Message } from '@/contexts/messagerie/domain/message.entity';

/**
 * 🎮 Controller REST pour la messagerie - VERSION SIMPLIFIÉE
 * Seulement 4 fonctionnalités essentielles :
 * 1. Créer un chat
 * 2. Envoyer un message
 * 3. Récupérer les messages d'un chat
 * 4. Récupérer les chats de l'utilisateur (pour l'interface)
 */
@ApiTags('💬 Messagerie')
@ApiCookieAuth('sAccessToken')
@Controller('messaging')
export class MessagerieController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * 🏠 Créer un nouveau chat
   * POST /messaging/chats
   */
  @Post('chats')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '🏠 Créer un nouveau chat',
    description:
      "Crée un nouveau chat avec un ou plusieurs participants. L'utilisateur actuel est automatiquement ajouté aux participants.",
  })
  @ApiBody({
    description: 'Données pour créer le chat',
    schema: {
      type: 'object',
      properties: {
        participants: {
          type: 'array',
          items: { type: 'string' },
          description:
            "Liste des IDs des participants (l'utilisateur actuel sera ajouté automatiquement)",
          example: ['alice', 'bob'],
        },
        name: {
          type: 'string',
          description: 'Nom du chat (optionnel)',
          example: 'Chat Alice & Bob',
        },
        description: {
          type: 'string',
          description: 'Description du chat (optionnel)',
          example: 'Discussion privée entre Alice et Bob',
        },
      },
      required: ['participants'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Chat créé avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Chat créé avec succès' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'chat_abc123' },
            name: { type: 'string', example: 'Chat Alice & Bob' },
            participants: {
              type: 'array',
              items: { type: 'string' },
              example: ['user123', 'alice', 'bob'],
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la création du chat',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Erreur lors de la création' },
      },
    },
  })
  async createChat(
    @Session('userId') userId: string,
    @Body() dto: CreateRoomRequestDto,
  ) {
    // Ajouter l'utilisateur actuel aux participants
    if (!dto.participants.includes(userId)) {
      dto.participants.push(userId);
    }

    const command = new CreateRoomCommand({
      participants: dto.participants,
      name: dto.name,
      description: dto.description,
    });

    const result: Result<Room> = await this.commandBus.execute(command);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: 'Chat créé avec succès',
      data: result.value,
    };
  }

  /**
   * 📤 Envoyer un message dans un chat
   * POST /messaging/chats/:chatId/messages
   */
  @Post('chats/:chatId/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '📤 Envoyer un message',
    description:
      'Envoie un message dans un chat spécifique. Le message sera diffusé en temps réel aux autres participants connectés.',
  })
  @ApiParam({
    name: 'chatId',
    description: 'ID du chat où envoyer le message',
    example: 'chat_abc123',
  })
  @ApiBody({
    description: 'Contenu du message à envoyer',
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Contenu textuel du message',
          example: 'Salut Bob ! Comment ça va ?',
          minLength: 1,
          maxLength: 1000,
        },
      },
      required: ['content'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Message envoyé avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Message envoyé' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'msg_xyz789' },
            content: { type: 'string', example: 'Salut Bob !' },
            senderId: { type: 'string', example: 'user123' },
            roomId: { type: 'string', example: 'chat_abc123' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Chat non trouvé ou accès non autorisé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Chat non trouvé' },
      },
    },
  })
  async sendMessage(
    @Session('userId') senderId: string,
    @Param('chatId') chatId: string,
    @Body() dto: { content: string },
  ) {
    const command: Result<Message> = await this.commandBus.execute(
      new SendMessageCommand({
        roomId: chatId,
        senderId,
        content: dto.content,
      }),
    );

    // Émettre l'événement pour le temps réel
    this.eventEmitter.emit('message.sent', {
      ...command,
      roomId: chatId,
    });

    return {
      success: true,
      message: 'Message envoyé',
      data: command,
    };
  }

  /**
   * 📬 Récupérer tous les messages d'un chat
   * GET /messaging/chats/:chatId/messages
   */
  @Get('chats/:chatId/messages')
  @ApiOperation({
    summary: "📬 Récupérer l'historique des messages",
    description:
      "Récupère tous les messages d'un chat avec pagination. Utile pour charger l'historique d'une conversation.",
  })
  @ApiParam({
    name: 'chatId',
    description: 'ID du chat dont récupérer les messages',
    example: 'chat_abc123',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Nombre maximum de messages à récupérer (défaut: 50)',
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: 'number',
    description: 'Nombre de messages à ignorer pour la pagination (défaut: 0)',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Messages récupérés avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'msg_xyz789' },
              content: { type: 'string', example: 'Salut Alice !' },
              senderId: { type: 'string', example: 'bob' },
              roomId: { type: 'string', example: 'chat_abc123' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        count: { type: 'number', example: 15 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès non autorisé au chat',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Accès non autorisé' },
        data: { type: 'array', example: [] },
      },
    },
  })
  async getChatMessages(
    @Session('userId') userId: string,
    @Param('chatId') chatId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const query = new GetMessagesQuery({
      roomId: chatId,
      userId,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    const result: Result<Message[]> = await this.queryBus.execute(query);

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
   * 🏠 Récupérer tous les chats de l'utilisateur
   * GET /messaging/chats
   */
  @Get('chats')
  @ApiOperation({
    summary: "🏠 Liste des chats de l'utilisateur",
    description:
      "Récupère tous les chats auxquels l'utilisateur participe. Utile pour afficher la liste des conversations dans l'interface.",
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Nombre maximum de chats à récupérer (défaut: 20)',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des chats récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'chat_abc123' },
              name: { type: 'string', example: 'Chat Alice & Bob' },
              description: { type: 'string', example: 'Discussion privée' },
              participants: {
                type: 'array',
                items: { type: 'string' },
                example: ['user123', 'alice', 'bob'],
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        count: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur serveur lors de la récupération des chats',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Erreur serveur' },
        data: { type: 'array', example: [] },
      },
    },
  })
  async getUserChats(
    @Session('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    const query = new GetUserRoomsQuery({
      userId,
      limit: limit ? parseInt(limit, 10) : 20,
      offset: 0,
    });

    const result: Result<Room[]> = await this.queryBus.execute(query);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
        data: [],
      };
    }

    const chats = result.value.map((room) => room.toPrimitive());

    return {
      success: true,
      data: chats,
      count: chats.length,
    };
  }
}

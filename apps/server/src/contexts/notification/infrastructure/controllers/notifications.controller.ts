import { Body, Controller, Post, Get, Patch, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../use-cases/commands/create-notification.command';
import { MarkNotificationReadCommand } from '../../use-cases/commands/mark-notification-read.command';
import { MarkAllNotificationsReadCommand } from '../../use-cases/commands/mark-all-notifications-read.command';
import { GetUnreadNotificationsQuery } from '../../use-cases/queries/get-unread-notifications.query';
import { Session } from 'supertokens-nestjs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Result } from '@/libs/result';
import { WsJwtService } from '@/auth/web-socket/jwt/ws-jwt.service';
import { CreateNotificationRequestDto } from './dto/create-notification-request.dto';
import { CreateNotificationResponseDto } from './dto/create-notification-response.dto';
import { GetUnreadNotificationsResponseDto } from './dto/get-unread-notifications-response.dto';
import { MarkNotificationReadResponseDto } from './dto/mark-notification-read-response.dto';
import { MarkAllNotificationsReadResponseDto } from './dto/mark-all-notifications-read-response.dto';
import { WsTokenResponseDto } from './dto/ws-token-response.dto';
import { Notification } from '../../domain/notification.entity';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly wsJwtService: WsJwtService,
  ) {
    console.log('NotificationsController constructor called'); // ← mets des logs ici
  }

  /**
   * Créer une nouvelle notification (endpoint de test)
   */
  @Post()
  @ApiOperation({
    summary: 'Créer une nouvelle notification',
    description:
      'Endpoint pour créer et envoyer une notification à un utilisateur (principalement pour les tests)',
  })
  @ApiBody({
    description: 'Données de la notification à créer',
    schema: {
      type: 'object',
      properties: {
        receiverId: {
          type: 'string',
          description: "ID de l'utilisateur qui reçoit la notification",
          example: 'user-123',
        },
        senderId: {
          type: 'string',
          description: "ID de l'utilisateur qui envoie la notification",
          example: 'user-456',
        },
        type: {
          type: 'string',
          description: 'Type de notification',
          example: 'project.created',
        },
        payload: {
          type: 'object',
          description: 'Données spécifiques à la notification',
          example: {
            projectTitle: 'Mon Super Projet',
            message: 'Votre projet a été créé avec succès !',
          },
        },
        channels: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['realtime', 'email'],
          },
          description: 'Canaux de diffusion (optionnel)',
          example: ['realtime'],
        },
      },
      required: ['receiverId', 'senderId', 'type', 'payload'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Notification créée et envoyée avec succès',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'sent' },
        message: {
          type: 'string',
          example: 'Notification créée et envoyée avec succès',
        },
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Erreur lors de l'envoi de la notification",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        message: {
          type: 'string',
          example:
            "Erreur lors de l'envoi en temps réel: L'utilisateur user-123 n'existe pas dans le système",
        },
        success: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  async create(
    @Body() dto: CreateNotificationRequestDto,
  ): Promise<CreateNotificationResponseDto> {
    const result = await this.commandBus.execute(
      new CreateNotificationCommand({
        receiverId: dto.receiverId,
        senderId: dto.senderId,
        type: dto.type,
        payload: dto.payload,
        channels: dto.channels || ['realtime'],
      }),
    );

    if (!result.success) {
      return CreateNotificationResponseDto.error(result.error);
    }

    return CreateNotificationResponseDto.success();
  }

  /**
   * Récupérer toutes les notifications non lues d'un utilisateur
   */
  @Get('unread')
  @ApiOperation({
    summary: 'Récupérer les notifications non lues',
    description:
      "Retourne toutes les notifications non lues de l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des notifications non lues récupérée avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
              receiverId: { type: 'string', example: 'user-123' },
              senderId: { type: 'string', example: 'user-456' },
              type: { type: 'string', example: 'project.created' },
              payload: {
                type: 'object',
                example: {
                  projectTitle: 'Mon Super Projet',
                  message: 'Votre projet a été créé avec succès !',
                },
              },
              createdAt: { type: 'string', format: 'date-time' },
              readAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: null,
              },
            },
          },
        },
        count: { type: 'number', example: 3 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  async getUnreadNotifications(
    @Session('userId') ownerId: string,
  ): Promise<
    GetUnreadNotificationsResponseDto | { success: false; error: string }
  > {
    if (!ownerId) {
      return { success: false, error: 'userId est requis' };
    }

    const result: Result<Notification[], string> = await this.queryBus.execute(
      new GetUnreadNotificationsQuery(ownerId),
    );

    if (result.success) {
      return GetUnreadNotificationsResponseDto.fromNotifications(result.value);
    } else {
      return {
        success: false,
        error: result.error,
      };
    }
  }

  /**
   * Marquer une notification spécifique comme lue
   */
  @Patch(':id/read')
  @ApiOperation({
    summary: 'Marquer une notification comme lue',
    description:
      "Marque une notification spécifique comme lue pour l'utilisateur connecté",
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique de la notification à marquer comme lue',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marquée comme lue avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Notification marquée comme lue' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors du marquage de la notification',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'Notification not found' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  async markAsRead(
    @Session('userId') ownerId: string,
    @Param('id') notificationId: string,
  ): Promise<MarkNotificationReadResponseDto> {
    const result: Result<void, string> = await this.commandBus.execute(
      new MarkNotificationReadCommand(notificationId, ownerId),
    );

    if (result.success) {
      return MarkNotificationReadResponseDto.success();
    } else {
      return MarkNotificationReadResponseDto.error(result.error);
    }
  }

  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  @Patch('read-all')
  @ApiOperation({
    summary: 'Marquer toutes les notifications comme lues',
    description:
      "Marque toutes les notifications non lues de l'utilisateur connecté comme lues",
  })
  @ApiResponse({
    status: 200,
    description: 'Toutes les notifications marquées comme lues avec succès',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Toutes les notifications marquées comme lues',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors du marquage des notifications',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string', example: 'receiverId est requis' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  async markAllAsRead(
    @Session('userId') ownerId: string,
  ): Promise<MarkAllNotificationsReadResponseDto> {
    if (!ownerId) {
      return MarkAllNotificationsReadResponseDto.error('receiverId est requis');
    }

    const result: Result<void, string> = await this.commandBus.execute(
      new MarkAllNotificationsReadCommand(ownerId),
    );

    if (result.success) {
      return MarkAllNotificationsReadResponseDto.success();
    } else {
      return MarkAllNotificationsReadResponseDto.error(result.error);
    }
  }

  @Get('ws-token')
  @ApiOperation({
    summary: 'Générer un token WebSocket',
    description:
      'Génère un token JWT pour les connexions WebSocket aux notifications',
  })
  @ApiResponse({
    status: 200,
    description: 'Token WebSocket généré avec succès',
    schema: {
      type: 'object',
      properties: {
        wsToken: { type: 'string', description: 'Token JWT pour WebSocket' },
        expiresIn: { type: 'number', example: 3600 },
        tokenType: { type: 'string', example: 'Bearer' },
      },
    },
  })
  async getWsToken(
    @Session('userId') userId: string,
  ): Promise<WsTokenResponseDto> {
    const wsToken = await this.wsJwtService.generateToken(userId);
    return WsTokenResponseDto.create(wsToken);
  }
}

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
import { NotificationsGateway } from '../gateways/notifications.gateway';

interface CreateNotificationDto {
  type: string;
  payload: Record<string, unknown>;
  // channels?: ('realtime' | 'email')[]  // optionnel
}

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
      },
      required: ['type', 'payload'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Notification créée et envoyée avec succès',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'sent' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  async create(
    @Session('userId') ownerId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    await this.commandBus.execute(
      new CreateNotificationCommand({
        userId: ownerId,
        type: dto.type,
        payload: dto.payload,
        channels: ['realtime'],
      }),
    );
    return { status: 'sent' };
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
              userId: { type: 'string', example: 'user-123' },
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
  async getUnreadNotifications(@Session('userId') ownerId: string) {
    if (!ownerId) {
      return { error: 'userId est requis' };
    }

    const result: Result<Notification[], string> = await this.queryBus.execute(
      new GetUnreadNotificationsQuery(ownerId),
    );

    if (result.success) {
      return {
        success: true,
        data: result.value,
        count: result.value.length,
      };
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
  ) {
    const result: Result<void, string> = await this.commandBus.execute(
      new MarkNotificationReadCommand(notificationId, ownerId),
    );

    if (result.success) {
      return { success: true, message: 'Notification marquée comme lue' };
    } else {
      return { success: false, error: result.error };
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
        error: { type: 'string', example: 'userId est requis' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
  })
  async markAllAsRead(@Session('userId') ownerId: string) {
    if (!ownerId) {
      return { error: 'userId est requis' };
    }

    const result: Result<void, string> = await this.commandBus.execute(
      new MarkAllNotificationsReadCommand(ownerId),
    );

    if (result.success) {
      return {
        success: true,
        message: 'Toutes les notifications marquées comme lues',
      };
    } else {
      return { success: false, error: result.error };
    }
  }

  // Endpoint HTTP pour générer un ws-token temporaire (usage unique, TTL court)
  // À appeler côté client avant d'ouvrir la connexion WebSocket
  @Post('ws-token')
  getWsToken(@Session('userId') userId: string) {
    // Récupère l'userId depuis la session SuperTokens (cookie httpOnly)
    if (!userId) {
      return { error: 'Not authenticated' };
    }
    const wsToken = NotificationsGateway.generateWsToken(userId);
    return { wsToken };
  }
}

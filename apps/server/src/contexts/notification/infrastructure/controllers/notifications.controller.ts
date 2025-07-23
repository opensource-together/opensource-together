import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  HttpStatus,
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    description:
      'Données de requête invalides ou utilisateur destinataire inexistant/non connecté',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: "L'utilisateur user-123 n'existe pas dans le système",
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: "Erreur de validation des données d'entrée",
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 422 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'receiverId should not be empty',
            'type should not be empty',
          ],
        },
        error: { type: 'string', example: 'Unprocessable Entity' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Une erreur interne est survenue' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async create(
    @Session('userId') senderId: string,
    @Body() dto: CreateNotificationRequestDto,
  ): Promise<CreateNotificationResponseDto> {
    try {
      // Validation : utilisateur connecté
      if (!senderId) {
        throw new BadRequestException(
          'Vous devez être connecté pour envoyer une notification',
        );
      }

      const result = await this.commandBus.execute(
        new CreateNotificationCommand({
          receiverId: dto.receiverId,
          senderId: senderId,
          type: dto.type,
          payload: dto.payload,
          channels: dto.channels || ['realtime'],
        }),
      );

      if (!result.success) {
        // Différencier les types d'erreurs
        if (result.error.includes("n'existe pas dans le système")) {
          throw new BadRequestException(
            result.error.replace("Erreur lors de l'envoi en temps réel: ", ''),
          );
        } else if (result.error.includes("n'est pas connecté via WebSocket")) {
          throw new BadRequestException(
            result.error.replace("Erreur lors de l'envoi en temps réel: ", ''),
          );
        } else {
          throw new HttpException(
            result.error,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      return CreateNotificationResponseDto.success();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Une erreur interne est survenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Utilisateur non authentifié' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example:
            'Une erreur interne est survenue lors de la récupération des notifications',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getUnreadNotifications(
    @Session('userId') ownerId: string,
  ): Promise<GetUnreadNotificationsResponseDto> {
    if (!ownerId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    try {
      const result: Result<Notification[], string> =
        await this.queryBus.execute(new GetUnreadNotificationsQuery(ownerId));

      if (result.success) {
        return GetUnreadNotificationsResponseDto.fromNotifications(
          result.value,
        );
      } else {
        throw new HttpException(
          'Une erreur interne est survenue lors de la récupération des notifications',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Une erreur interne est survenue lors de la récupération des notifications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
    description: 'ID de notification invalide',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'ID de notification invalide' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Utilisateur non authentifié' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - Cette notification ne vous appartient pas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: {
          type: 'string',
          example: 'Cette notification ne vous appartient pas',
        },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Notification non trouvée',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Notification non trouvée' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Une erreur interne est survenue' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async markAsRead(
    @Session('userId') ownerId: string,
    @Param('id') notificationId: string,
  ): Promise<MarkNotificationReadResponseDto> {
    if (!ownerId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    if (!notificationId || notificationId.trim() === '') {
      throw new BadRequestException('ID de notification invalide');
    }

    try {
      const result: Result<void, string> = await this.commandBus.execute(
        new MarkNotificationReadCommand(notificationId, ownerId),
      );

      if (result.success) {
        return MarkNotificationReadResponseDto.success();
      } else {
        // Différencier les types d'erreurs
        if (
          result.error.includes('not found') ||
          result.error.includes('non trouvée')
        ) {
          throw new NotFoundException('Notification non trouvée');
        } else if (
          result.error.includes('not the owner') ||
          result.error.includes('ne vous appartient pas')
        ) {
          throw new HttpException(
            'Cette notification ne vous appartient pas',
            HttpStatus.FORBIDDEN,
          );
        } else {
          throw new HttpException(
            'Une erreur interne est survenue',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Une erreur interne est survenue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
    status: 401,
    description: 'Utilisateur non authentifié',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Utilisateur non authentifié' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example:
            'Une erreur interne est survenue lors du marquage des notifications',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async markAllAsRead(
    @Session('userId') ownerId: string,
  ): Promise<MarkAllNotificationsReadResponseDto> {
    if (!ownerId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    try {
      const result: Result<void, string> = await this.commandBus.execute(
        new MarkAllNotificationsReadCommand(ownerId),
      );

      if (result.success) {
        return MarkAllNotificationsReadResponseDto.success();
      } else {
        throw new HttpException(
          'Une erreur interne est survenue lors du marquage des notifications',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Une erreur interne est survenue lors du marquage des notifications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
  @ApiResponse({
    status: 401,
    description: 'Utilisateur non authentifié',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Utilisateur non authentifié' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erreur interne du serveur lors de la génération du token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example:
            'Une erreur interne est survenue lors de la génération du token',
        },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async getWsToken(
    @Session('userId') userId: string,
  ): Promise<WsTokenResponseDto> {
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    try {
      const wsToken = await this.wsJwtService.generateToken(userId);
      return WsTokenResponseDto.create(wsToken);
    } catch (error) {
      throw new HttpException(
        'Une erreur interne est survenue lors de la génération du token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

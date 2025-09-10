import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Session, UserSession, AuthGuard } from '@thallesp/nestjs-better-auth';
import {
  CreateNotificationRequestDto,
  CreateNotificationResponseDto,
  GetUnreadNotificationsResponseDto,
  MarkAllNotificationsReadResponseDto,
  MarkNotificationReadResponseDto,
  WsTokenResponseDto,
} from './dto';
import {
  NotificationServiceInterface,
  NOTIFICATION_SERVICE,
} from '../services';
import { Inject } from '@nestjs/common';
import { WebSocketAuthService } from '@/auth/web-socket';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServiceInterface,
    private readonly wsAuthService: WebSocketAuthService,
  ) {}

  /**
   * Créer une nouvelle notification (endpoint de test)
   */
  @Post()
  async create(
    @Session() session: UserSession,
    @Body() dto: CreateNotificationRequestDto,
  ): Promise<CreateNotificationResponseDto> {
    try {
      // Validation : utilisateur connecté
      if (!session?.user?.id) {
        throw new BadRequestException(
          'Vous devez être connecté pour envoyer une notification',
        );
      }

      const result = await this.notificationService.sendNotification({
        object: dto.object,
        receiverId: dto.receiverId,
        senderId: session.user.id,
        type: dto.type,
        payload: dto.payload,
        channels: dto.channels || ['realtime'],
      });

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
  async getUnreadNotifications(
    @Session() session: UserSession,
  ): Promise<GetUnreadNotificationsResponseDto> {
    if (!session?.user?.id) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    try {
      const result = await this.notificationService.getUnreadNotifications(
        session.user.id,
      );

      if (result.success) {
        return new GetUnreadNotificationsResponseDto(result.value);
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
  async markAsRead(
    @Session() session: UserSession,
    @Param('id') notificationId: string,
  ): Promise<MarkNotificationReadResponseDto> {
    if (!session?.user?.id) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    if (!notificationId || notificationId.trim() === '') {
      throw new BadRequestException('ID de notification invalide');
    }

    try {
      // D'abord vérifier que la notification appartient à l'utilisateur
      const notifResult =
        await this.notificationService.getNotificationById(notificationId);
      if (!notifResult.success) {
        throw new NotFoundException('Notification non trouvée');
      }

      if (notifResult.value.receiverId !== session.user.id) {
        throw new HttpException(
          'Cette notification ne vous appartient pas',
          HttpStatus.FORBIDDEN,
        );
      }

      const result =
        await this.notificationService.markNotificationAsRead(notificationId);

      if (!result.success) {
        throw new HttpException(
          'Une erreur interne est survenue',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return MarkNotificationReadResponseDto.success();
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
  async markAllAsRead(
    @Session() session: UserSession,
  ): Promise<MarkAllNotificationsReadResponseDto> {
    if (!session?.user?.id) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    try {
      const result = await this.notificationService.markAllNotificationsAsRead(
        session.user.id,
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

  @UseGuards(AuthGuard)
  @Get('ws-token')
  async getWsToken(
    @Session() session: UserSession,
  ): Promise<WsTokenResponseDto> {
    if (!session?.user?.id) {
      console.log('session', session);
      throw new UnauthorizedException('Utilisateur non authentifié');
    }

    try {
      const wsToken = await this.wsAuthService.generateToken(session.user.id);
      return new WsTokenResponseDto(wsToken);
    } catch (error) {
      throw new HttpException(
        'Une erreur interne est survenue lors de la génération du token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

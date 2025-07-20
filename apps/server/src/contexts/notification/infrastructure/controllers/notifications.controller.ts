import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNotificationCommand } from '../../use-cases/commands/create-notification.command';
import { MarkNotificationReadCommand } from '../../use-cases/commands/mark-notification-read.command';
import { MarkAllNotificationsReadCommand } from '../../use-cases/commands/mark-all-notifications-read.command';
import { GetUnreadNotificationsQuery } from '../../use-cases/queries/get-unread-notifications.query';
import { PublicAccess, Session } from 'supertokens-nestjs';

interface CreateNotificationDto {
  type: string;
  payload: Record<string, unknown>;
  // channels?: ('realtime' | 'email')[]  // optionnel
}

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
  async getUnreadNotifications(@Session('userId') ownerId: string) {
    if (!ownerId) {
      return { error: 'userId est requis' };
    }

    const result = await this.queryBus.execute(
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
  async markAsRead(
    @Session('userId') ownerId: string,
    @Param('id') notificationId: string,
  ) {
    const result = await this.commandBus.execute(
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
  async markAllAsRead(@Session('userId') ownerId: string) {
    if (!ownerId) {
      return { error: 'userId est requis' };
    }

    const result = await this.commandBus.execute(
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
}

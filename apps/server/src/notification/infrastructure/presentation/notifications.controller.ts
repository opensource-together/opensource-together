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
import { CreateNotificationCommand } from '@/notification/use-cases/commands/create-notification.command';
import { MarkNotificationReadCommand } from '@/notification/use-cases/commands/mark-notification-read.command';
import { MarkAllNotificationsReadCommand } from '@/notification/use-cases/commands/mark-all-notifications-read.command';
import { GetUnreadNotificationsQuery } from '@/notification/use-cases/queries/get-unread-notifications.query';
import { PublicAccess } from 'supertokens-nestjs';

interface CreateNotificationDto {
  userId: string;
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
  @PublicAccess()
  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    console.log('create notification', dto);
    await this.commandBus.execute(
      new CreateNotificationCommand({
        userId: dto.userId,
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
  @PublicAccess()
  @Get('unread')
  async getUnreadNotifications(@Query('userId') userId: string) {
    if (!userId) {
      return { error: 'userId est requis' };
    }

    const result = await this.queryBus.execute(
      new GetUnreadNotificationsQuery(userId),
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
  @PublicAccess()
  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string) {
    const result = await this.commandBus.execute(
      new MarkNotificationReadCommand(notificationId),
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
  @PublicAccess()
  @Patch('read-all')
  async markAllAsRead(@Body() body: { userId: string }) {
    if (!body.userId) {
      return { error: 'userId est requis' };
    }

    const result = await this.commandBus.execute(
      new MarkAllNotificationsReadCommand(body.userId),
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

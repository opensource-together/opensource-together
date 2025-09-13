import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma, PrismaClientKnownRequestError } from '@prisma/client';
import { Result } from '@/libs/result';
import {
  CreateNotificationData,
  NotificationData,
  NotificationRepository,
} from './notification.repository.interface';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  private readonly logger = new Logger(PrismaNotificationRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateNotificationData,
  ): Promise<Result<NotificationData, string>> {
    try {
      const createdNotification = await this.prisma.notification.create({
        data: {
          object: data.object,
          receiverId: data.receiverId,
          senderId: data.senderId,
          type: data.type,
          payload: data.payload as Prisma.InputJsonValue,
        },
      });

      const notificationData: NotificationData = {
        id: createdNotification.id,
        object: createdNotification.object,
        receiverId: createdNotification.receiverId,
        senderId: createdNotification.senderId,
        type: createdNotification.type,
        payload: createdNotification.payload as Record<string, unknown>,
        createdAt: createdNotification.createdAt,
        readAt: createdNotification.readAt,
      };

      return Result.ok(notificationData);
    } catch (error) {
      this.logger.error('Error creating notification:', error);

      // Gestion spécifique des erreurs de contrainte de clé étrangère
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          if (error.meta?.field_name === 'Notification_senderId_fkey') {
            return Result.fail('SENDER_NOT_FOUND');
          }
          if (error.meta?.field_name === 'Notification_receiverId_fkey') {
            return Result.fail('RECEIVER_NOT_FOUND');
          }
        }
      }

      return Result.fail('DATABASE_ERROR');
    }
  }

  async findUnreadByUserId(
    userId: string,
  ): Promise<Result<NotificationData[], string>> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          receiverId: userId,
          readAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const notificationData: NotificationData[] = notifications.map((n) => ({
        id: n.id,
        object: n.object,
        receiverId: n.receiverId,
        senderId: n.senderId,
        type: n.type,
        payload: n.payload as Record<string, unknown>,
        createdAt: n.createdAt,
        readAt: n.readAt,
      }));

      return Result.ok(notificationData);
    } catch (error) {
      this.logger.error('Error fetching unread notifications:', error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async findById(
    notificationId: string,
  ): Promise<Result<NotificationData, string>> {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        return Result.fail('NOTIFICATION_NOT_FOUND');
      }

      const notificationData: NotificationData = {
        id: notification.id,
        object: notification.object,
        receiverId: notification.receiverId,
        senderId: notification.senderId,
        type: notification.type,
        payload: notification.payload as Record<string, unknown>,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      };

      return Result.ok(notificationData);
    } catch (error) {
      this.logger.error('Error fetching notification:', error);
      return Result.fail('DATABASE_ERROR');
    }
  }

  async markAsRead(
    notificationId: string,
  ): Promise<Result<NotificationData, string>> {
    try {
      const updatedNotification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      });

      const notificationData: NotificationData = {
        id: updatedNotification.id,
        object: updatedNotification.object,
        receiverId: updatedNotification.receiverId,
        senderId: updatedNotification.senderId,
        type: updatedNotification.type,
        payload: updatedNotification.payload as Record<string, unknown>,
        createdAt: updatedNotification.createdAt,
        readAt: updatedNotification.readAt,
      };

      return Result.ok(notificationData);
    } catch (error) {
      this.logger.error('Error marking notification as read:', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return Result.fail('NOTIFICATION_NOT_FOUND');
        }
      }

      return Result.fail('DATABASE_ERROR');
    }
  }

  async markAllAsReadByUserId(
    userId: string,
  ): Promise<Result<NotificationData[], string>> {
    try {
      // Récupérer les notifications non lues pour les retourner
      const unreadNotifications = await this.prisma.notification.findMany({
        where: {
          receiverId: userId,
          readAt: null,
        },
      });

      if (unreadNotifications.length === 0) {
        return Result.ok([]);
      }

      // Marquer toutes comme lues
      const readAt = new Date();
      await this.prisma.notification.updateMany({
        where: {
          receiverId: userId,
          readAt: null,
        },
        data: { readAt },
      });

      // Construire les données de retour avec la nouvelle date de lecture
      const updatedNotifications: NotificationData[] = unreadNotifications.map(
        (notification) => ({
          id: notification.id,
          object: notification.object,
          receiverId: notification.receiverId,
          senderId: notification.senderId,
          type: notification.type,
          payload: notification.payload as Record<string, unknown>,
          createdAt: notification.createdAt,
          readAt: readAt,
        }),
      );

      return Result.ok(updatedNotifications);
    } catch (error) {
      this.logger.error('Error marking all notifications as read:', error);
      return Result.fail('DATABASE_ERROR');
    }
  }
}

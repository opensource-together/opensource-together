import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import {
  NotificationServicePort,
  SendNotificationPayload,
  NotificationData,
} from '../../use-cases/ports/notification.service.port';
import { Result } from '@/libs/result';
import { RealtimeNotifierAdapter } from './realtime-notifier.adapter';

/**
 * Service d'implémentation du port NotificationServicePort.
 * Responsable de la persistance et de la livraison technique.
 * Couche Infrastructure - ne gère pas la logique du domaine.
 */
@Injectable()
export class NotificationService implements NotificationServicePort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeAdapter: RealtimeNotifierAdapter,
  ) {}

  /**
   * Envoie une notification : persiste puis délègue aux canaux.
   * @param notification - Payload de la notification
   * @returns Result<void, string> - Succès ou erreur
   */
  async sendNotification(
    notification: SendNotificationPayload,
  ): Promise<Result<void, string>> {
    try {
      // 1. Persister en base de données
      const createdNotification = await this.prisma.notification.create({
        data: {
          userId: notification.userId,
          type: notification.type,
          payload: notification.payload as any,
        },
      });

      // 2. Construire les données brutes pour l'adapter
      const notificationData: NotificationData = {
        id: createdNotification.id,
        userId: createdNotification.userId,
        type: createdNotification.type,
        payload: createdNotification.payload as Record<string, unknown>,
        createdAt: createdNotification.createdAt,
        readAt: createdNotification.readAt,
      };

      // 3. Envoyer aux canaux appropriés
      const channels = notification.channels || ['realtime'];

      for (const channel of channels) {
        if (channel === 'realtime') {
          await this.realtimeAdapter.send(notificationData);
        }
        // TODO: Ajouter d'autres canaux (email, etc.)
      }

      return Result.ok(undefined);
    } catch (error) {
      console.error('Error sending notification:', error);
      return Result.fail('Failed to send notification');
    }
  }

  /**
   * Récupère toutes les notifications non lues d'un utilisateur.
   * @param userId - ID de l'utilisateur
   * @returns Result<NotificationData[], string> - Données brutes des notifications
   */
  async getUnreadNotifications(
    userId: string,
  ): Promise<Result<NotificationData[], string>> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId: userId,
          readAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const notificationData: NotificationData[] = notifications.map((n) => ({
        id: n.id,
        userId: n.userId,
        type: n.type,
        payload: n.payload as Record<string, unknown>,
        createdAt: n.createdAt,
        readAt: n.readAt,
      }));

      return Result.ok(notificationData);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return Result.fail('Failed to fetch unread notifications');
    }
  }

  /**
   * Marque une notification comme lue.
   * @param notificationId - ID de la notification
   * @returns Result<void, string> - Succès ou erreur
   */
  async markNotificationAsRead(
    notificationId: string,
  ): Promise<Result<void, string>> {
    try {
      // Mettre à jour la notification
      const updatedNotification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      });

      // Construire les données pour l'adapter
      const notificationData: NotificationData = {
        id: updatedNotification.id,
        userId: updatedNotification.userId,
        type: updatedNotification.type,
        payload: updatedNotification.payload as Record<string, unknown>,
        createdAt: updatedNotification.createdAt,
        readAt: updatedNotification.readAt,
      };

      // Notifier en temps réel
      await this.realtimeAdapter.sendNotificationUpdate(notificationData);

      return Result.ok(undefined);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return Result.fail('Failed to mark notification as read');
    }
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues.
   * @param userId - ID de l'utilisateur
   * @returns Result<void, string> - Succès ou erreur
   */
  async markAllNotificationsAsRead(
    userId: string,
  ): Promise<Result<void, string>> {
    try {
      // Récupérer les notifications non lues pour les notifier individuellement
      const unreadNotifications = await this.prisma.notification.findMany({
        where: {
          userId: userId,
          readAt: null,
        },
      });

      if (unreadNotifications.length === 0) {
        return Result.ok(undefined);
      }

      // Marquer toutes comme lues
      const readAt = new Date();
      await this.prisma.notification.updateMany({
        where: {
          userId: userId,
          readAt: null,
        },
        data: { readAt },
      });

      // Notifier en temps réel pour chaque notification
      for (const notification of unreadNotifications) {
        const notificationData: NotificationData = {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          payload: notification.payload as Record<string, unknown>,
          createdAt: notification.createdAt,
          readAt: readAt,
        };

        await this.realtimeAdapter.sendNotificationUpdate(notificationData);
      }

      return Result.ok(undefined);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return Result.fail('Failed to mark all notifications as read');
    }
  }

  async getNotificationById(
    notificationId: string,
  ): Promise<Result<NotificationData, string>> {
    try {
      const notification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        return Result.fail('Notification not found');
      }

      return Result.ok({
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        payload: notification.payload as Record<string, unknown>,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });
    } catch (error) {
      return Result.fail('Failed to fetch notification');
    }
  }
}

import { Result } from '@/libs/result';
import { PrismaService } from '@/persistence/orm/prisma/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  NotificationData,
  NotificationServicePort,
  SendNotificationPayload,
} from '../../use-cases/ports/notification.service.port';
import { RealtimeNotifierAdapter } from './realtime-notifier.adapter';

/**
 * Service d'implémentation du port NotificationServicePort.
 * Responsable de la persistance et de la livraison technique.
 * Couche Infrastructure - ne gère pas la logique du domaine.
 */
@Injectable()
export class NotificationService implements NotificationServicePort {
  private readonly logger = new Logger(NotificationService.name);
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
      // Persister en base de données
      const createdNotification = await this.prisma.notification.create({
        data: {
          object: notification.object,
          receiverId: notification.receiverId,
          senderId: notification.senderId,
          type: notification.type,
          payload: notification.payload as Prisma.InputJsonValue,
        },
      });

      // Construire les données brutes pour l'adapter
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

      // Envoyer aux canaux appropriés
      const channels = notification.channels || ['realtime'];
      let realtimeError: string | null = null;

      for (const channel of channels) {
        if (channel === 'realtime') {
          realtimeError = await this.realtimeAdapter.send(notificationData);
        }
        // TODO: Ajouter d'autres canaux (email, etc.)
      }

      // Si il y a une erreur lors de l'envoi en temps réel, la retourner
      if (realtimeError) {
        return Result.fail(
          `Erreur lors de l'envoi en temps réel: ${realtimeError}`,
        );
      }

      return Result.ok(undefined);
    } catch (error) {
      this.logger.error('Error sending notification:', error);

      // Gestion spécifique des erreurs de contrainte de clé étrangère
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          if (error.meta?.constraint === 'Notification_senderId_fkey') {
            return Result.fail(
              `L'utilisateur expéditeur n'existe pas ou n'est pas connecté`,
            );
          }
          if (error.meta?.constraint === 'Notification_receiverId_fkey') {
            return Result.fail(`L'utilisateur destinataire n'existe pas`);
          }
        }
      }

      return Result.fail("Erreur lors de l'envoi de la notification");
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
        object: updatedNotification.object,
        receiverId: updatedNotification.receiverId,
        senderId: updatedNotification.senderId,
        type: updatedNotification.type,
        payload: updatedNotification.payload as Record<string, unknown>,
        createdAt: updatedNotification.createdAt,
        readAt: updatedNotification.readAt,
      };

      // Notifier en temps réel
      const updateError =
        await this.realtimeAdapter.sendNotificationUpdate(notificationData);

      // Si il y a une erreur lors de l'envoi en temps réel, la retourner
      if (updateError) {
        return Result.fail(
          `Erreur lors de l'envoi de la mise à jour en temps réel: ${updateError}`,
        );
      }

      return Result.ok(undefined);
    } catch (error) {
      this.logger.error('Error marking notification as read:', error);
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
          receiverId: userId,
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
          receiverId: userId,
          readAt: null,
        },
        data: { readAt },
      });

      // Notifier en temps réel pour chaque notification
      for (const notification of unreadNotifications) {
        const notificationData: NotificationData = {
          id: notification.id,
          object: notification.object,
          receiverId: notification.receiverId,
          senderId: notification.senderId,
          type: notification.type,
          payload: notification.payload as Record<string, unknown>,
          createdAt: notification.createdAt,
          readAt: readAt,
        };

        const updateError =
          await this.realtimeAdapter.sendNotificationUpdate(notificationData);

        // Note: Pour markAllNotificationsAsRead, on ne fait pas échouer toute l'opération
        // si une notification individuelle ne peut pas être envoyée en temps réel
        if (updateError) {
          this.logger.warn(
            `Avertissement lors de l'envoi de la mise à jour: ${updateError}`,
          );
        }
      }

      return Result.ok(undefined);
    } catch (error) {
      this.logger.error('Error marking all notifications as read:', error);
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
        object: notification.object,
        receiverId: notification.receiverId,
        senderId: notification.senderId,
        type: notification.type,
        payload: notification.payload as Record<string, unknown>,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });
    } catch (error) {
      this.logger.error('Error fetching notification:', error);
      return Result.fail('Failed to fetch notification');
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/orm/prisma/prisma.service';
import {
  NotificationServicePort,
  SendNotificationPayload,
  NotificationData,
} from './use-cases/ports/notification.service.port';
import { Result } from '@/libs/result';
import { RealtimeNotifierAdapter } from './infrastructure/adapters/realtime-notifier.adapter';

/**
 * Service d'implémentation du port NotificationServicePort.
 * Responsable de l'orchestration entre persistance et livraison.
 * Couche Infrastructure - dépend de Prisma et des adapters.
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
      // Debug : vérifier que tous les champs sont présents
      console.log('Sending notification:', {
        userId: notification.userId,
        type: notification.type,
        payload: notification.payload,
        channels: notification.channels,
      });

      // 1. Persistance en base de données et récupération de la notification créée avec son ID
      const createdNotification = await this.prisma.notification.create({
        data: {
          userId: notification.userId,
          type: notification.type,
          payload: notification.payload as any, // Cast pour compatibilité Prisma JsonValue
          // createdAt est automatique via @default(now()) dans le schema
          // readAt reste null par défaut
        },
      });

      // 2. Construire l'objet NotificationData avec l'ID généré
      const notificationData: NotificationData = {
        id: createdNotification.id,
        userId: createdNotification.userId,
        type: createdNotification.type,
        payload: createdNotification.payload as Record<string, unknown>,
        createdAt: createdNotification.createdAt,
        readAt: createdNotification.readAt,
      };

      // 3. Livraison via les canaux demandés (défaut: realtime)
      const channels = notification.channels ?? ['realtime'];

      if (channels.includes('realtime')) {
        await this.realtimeAdapter.send(notificationData);
      }

      // TODO: Ajouter d'autres canaux (email, push) plus tard
      // if (channels.includes('email')) {
      //   await this.emailAdapter.send(notificationData);
      // }

      return Result.ok(undefined);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
      return Result.fail("Erreur technique lors de l'envoi de la notification");
    }
  }

  /**
   * Récupère toutes les notifications non lues d'un utilisateur.
   * @param userId - ID de l'utilisateur
   * @returns Result<NotificationData[], string> - Liste des notifications ou erreur
   */
  async getUnreadNotifications(
    userId: string,
  ): Promise<Result<NotificationData[], string>> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
          readAt: null, // Notifications non lues uniquement
        },
        orderBy: {
          createdAt: 'desc', // Plus récentes en premier
        },
      });

      const notificationData: NotificationData[] = notifications.map(
        (notif) => ({
          id: notif.id,
          userId: notif.userId,
          type: notif.type,
          payload: notif.payload as Record<string, unknown>,
          createdAt: notif.createdAt,
          readAt: notif.readAt,
        }),
      );

      return Result.ok(notificationData);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des notifications non lues:',
        error,
      );
      return Result.fail(
        'Erreur technique lors de la récupération des notifications',
      );
    }
  }

  /**
   * Marque une notification spécifique comme lue.
   * @param notificationId - ID de la notification
   * @returns Result<void, string> - Succès ou erreur
   */
  async markNotificationAsRead(
    notificationId: string,
  ): Promise<Result<void, string>> {
    try {
      // Mettre à jour la notification et récupérer les données complètes
      const updatedNotification = await this.prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      });

      // Construire l'objet NotificationData avec les nouvelles données
      const notificationData: NotificationData = {
        id: updatedNotification.id,
        userId: updatedNotification.userId,
        type: updatedNotification.type,
        payload: updatedNotification.payload as Record<string, unknown>,
        createdAt: updatedNotification.createdAt,
        readAt: updatedNotification.readAt,
      };

      // 🆕 NOUVEAU : Émettre l'événement de mise à jour en temps réel
      await this.realtimeAdapter.sendNotificationUpdate(notificationData);

      return Result.ok(undefined);
    } catch (error) {
      console.error(
        'Erreur lors du marquage de la notification comme lue:',
        error,
      );
      return Result.fail(
        'Erreur technique lors du marquage de la notification',
      );
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
      // Récupérer d'abord les notifications non lues pour pouvoir les mettre à jour individuellement
      const unreadNotifications = await this.prisma.notification.findMany({
        where: {
          userId,
          readAt: null, // Seulement celles qui ne sont pas déjà lues
        },
      });

      // Marquer toutes comme lues
      const readAt = new Date();
      await this.prisma.notification.updateMany({
        where: {
          userId,
          readAt: null,
        },
        data: { readAt },
      });

      // 🆕 NOUVEAU : Émettre les événements de mise à jour en temps réel pour chaque notification
      for (const notification of unreadNotifications) {
        const notificationData: NotificationData = {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          payload: notification.payload as Record<string, unknown>,
          createdAt: notification.createdAt,
          readAt: readAt, // Utiliser la même date pour toutes
        };

        await this.realtimeAdapter.sendNotificationUpdate(notificationData);
      }

      return Result.ok(undefined);
    } catch (error) {
      console.error(
        'Erreur lors du marquage de toutes les notifications comme lues:',
        error,
      );
      return Result.fail('Erreur technique lors du marquage des notifications');
    }
  }
}

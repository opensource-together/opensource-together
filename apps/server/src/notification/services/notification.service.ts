import { Result } from '@/libs/result';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  NotificationData,
  NotificationServiceInterface,
  SendNotificationPayload,
} from './notification.service.interface';
import { RealtimeNotifierAdapter } from './realtime-notifier.adapter';
import { validateNotification } from '../domain/notification';
import {
  NOTIFICATION_REPOSITORY,
  NotificationRepository,
} from '../repositories/notification.repository.interface';

/**
 * Service d'implémentation pour les notifications.
 * Responsable de la persistance et de la livraison technique.
 */
@Injectable()
export class NotificationService implements NotificationServiceInterface {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
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
      console.log('sendNotification', notification);
      // Valider les données
      const validationResult = validateNotification(notification);
      if (!validationResult.success) {
        console.log('validationErrors', validationResult.error);
        return Result.fail(`Validation failed: ${validationResult.error}`);
      }

      // Persister en base de données via le repository
      const createResult = await this.notificationRepository.create({
        object: notification.object,
        receiverId: notification.receiverId,
        senderId: notification.senderId,
        type: notification.type,
        payload: notification.payload,
      });

      if (!createResult.success) {
        // Gestion des erreurs spécifiques du repository
        if (createResult.error === 'SENDER_NOT_FOUND') {
          return Result.fail("L'utilisateur expéditeur n'existe pas");
        }
        if (createResult.error === 'RECEIVER_NOT_FOUND') {
          return Result.fail("L'utilisateur destinataire n'existe pas");
        }
        if (createResult.error === 'DATABASE_ERROR') {
          return Result.fail('Erreur de base de données lors de la création');
        }
        return Result.fail('Erreur lors de la création de la notification');
      }

      const notificationData = createResult.value;

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
    const result = await this.notificationRepository.findUnreadByUserId(userId);

    if (!result.success) {
      this.logger.error(
        `Error fetching unread notifications for user ${userId}: ${result.error}`,
      );
      return Result.fail('Impossible de récupérer les notifications non lues');
    }

    return Result.ok(result.value);
  }

  /**
   * Marque une notification comme lue.
   * @param notificationId - ID de la notification
   * @returns Result<void, string> - Succès ou erreur
   */
  async markNotificationAsRead(
    notificationId: string,
  ): Promise<Result<void, string>> {
    // Marquer comme lue via le repository
    const result = await this.notificationRepository.markAsRead(notificationId);

    if (!result.success) {
      if (result.error === 'NOTIFICATION_NOT_FOUND') {
        return Result.fail('Notification non trouvée');
      }
      if (result.error === 'DATABASE_ERROR') {
        return Result.fail('Erreur de base de données lors du marquage');
      }
      this.logger.error(`Error marking notification as read: ${result.error}`);
      return Result.fail('Impossible de marquer la notification comme lue');
    }

    const notificationData = result.value;

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
  }

  /**
   * Marque toutes les notifications d'un utilisateur comme lues.
   * @param userId - ID de l'utilisateur
   * @returns Result<void, string> - Succès ou erreur
   */
  async markAllNotificationsAsRead(
    userId: string,
  ): Promise<Result<void, string>> {
    // Marquer toutes comme lues via le repository
    const result =
      await this.notificationRepository.markAllAsReadByUserId(userId);

    if (!result.success) {
      this.logger.error(
        `Error marking all notifications as read: ${result.error}`,
      );
      return Result.fail(
        'Impossible de marquer toutes les notifications comme lues',
      );
    }

    const updatedNotifications = result.value;

    if (updatedNotifications.length === 0) {
      return Result.ok(undefined);
    }

    // Notifier en temps réel pour chaque notification
    for (const notificationData of updatedNotifications) {
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
  }

  async getNotificationById(
    notificationId: string,
  ): Promise<Result<NotificationData, string>> {
    const result = await this.notificationRepository.findById(notificationId);

    if (!result.success) {
      if (result.error === 'NOTIFICATION_NOT_FOUND') {
        return Result.fail('Notification non trouvée');
      }
      if (result.error === 'DATABASE_ERROR') {
        return Result.fail('Erreur de base de données lors de la récupération');
      }
      this.logger.error(`Error fetching notification: ${result.error}`);
      return Result.fail('Impossible de récupérer la notification');
    }

    return Result.ok(result.value);
  }
}

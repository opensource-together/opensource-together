import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/orm/prisma/prisma.service';
import {
  NotificationServicePort,
  SendNotificationPayload,
} from '../../ports/notification.service.port';
import { Result } from '@/libs/result';
import { RealtimeNotifierAdapter } from '../adapters/realtime-notifier.adapter';

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

      // 1. Persistance en base de données
      await this.prisma.notification.create({
        data: {
          userId: notification.userId,
          type: notification.type,
          payload: notification.payload as any, // Cast pour compatibilité Prisma JsonValue
          // createdAt est automatique via @default(now()) dans le schema
        },
      });

      // 2. Livraison via les canaux demandés (défaut: realtime)
      const channels = notification.channels ?? ['realtime'];

      if (channels.includes('realtime')) {
        await this.realtimeAdapter.send(notification);
      }

      // TODO: Ajouter d'autres canaux (email, push) plus tard
      // if (channels.includes('email')) {
      //   await this.emailAdapter.send(notification);
      // }

      return Result.ok(undefined);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
      return Result.fail("Erreur technique lors de l'envoi de la notification");
    }
  }
}

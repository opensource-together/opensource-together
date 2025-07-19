import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { NotificationData } from '../../use-cases/ports/notification.service.port';
import { NotificationsGateway } from '../gateways/notifications.gateway';

/**
 * Adapter pour les notifications en temps réel.
 * Implémente l'envoi via WebSocket Gateway.
 */
@Injectable()
export class RealtimeNotifierAdapter {
  constructor(
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly gateway: NotificationsGateway,
  ) {}

  /**
   * Envoie une notification en temps réel.
   * @param notification - Données complètes de la notification avec ID
   */
  async send(notification: NotificationData): Promise<void> {
    await this.gateway.emitToUser(notification);
  }

  /**
   * 🆕 NOUVEAU : Envoie une mise à jour d'état de notification en temps réel.
   * @param notification - Données complètes de la notification mise à jour
   */
  async sendNotificationUpdate(notification: NotificationData): Promise<void> {
    await this.gateway.emitNotificationUpdate(notification);
  }
}

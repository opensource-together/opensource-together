import { Injectable } from '@nestjs/common';
import { SendNotificationPayload } from '../../ports/notification.service.port';
import { NotificationsGateway } from '../gateways/notifications.gateway';

/**
 * Adapter pour les notifications en temps réel.
 * Implémente l'envoi via WebSocket Gateway.
 */
@Injectable()
export class RealtimeNotifierAdapter {
  constructor(private readonly gateway: NotificationsGateway) {}

  /**
   * Envoie une notification en temps réel.
   * @param notification - Payload de la notification
   */
  async send(notification: SendNotificationPayload): Promise<void> {
    await this.gateway.emitToUser(notification.userId, notification);
  }
}

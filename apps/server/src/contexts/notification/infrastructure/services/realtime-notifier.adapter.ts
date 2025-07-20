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
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Envoie une nouvelle notification en temps réel
   */
  async send(notification: NotificationData): Promise<void> {
    await this.notificationsGateway.emitToUser(notification);
  }

  /**
   * Envoie une mise à jour de notification (ex: marquée comme lue)
   */
  async sendNotificationUpdate(notification: NotificationData): Promise<void> {
    await this.notificationsGateway.emitNotificationUpdate(notification);
  }
}

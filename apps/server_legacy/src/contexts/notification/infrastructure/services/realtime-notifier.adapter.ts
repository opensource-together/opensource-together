import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  NOTIFICATION_GATEWAY_PORT,
  NotificationGatewayPort,
} from '../../use-cases/ports/notification.gateway.port';
import { NotificationData } from '../../use-cases/ports/notification.service.port';

/**
 * Adapter pour l'envoi de notifications en temps réel via WebSocket.
 * Fait le lien entre le service de notifications et le gateway WebSocket.
 */
@Injectable()
export class RealtimeNotifierAdapter {
  constructor(
    @Inject(forwardRef(() => NOTIFICATION_GATEWAY_PORT))
    private readonly notificationsGateway: NotificationGatewayPort,
  ) {}

  /**
   * Envoie une notification en temps réel à un utilisateur
   * @returns null si succès, string avec message d'erreur sinon
   */
  async send(notification: NotificationData): Promise<string | null> {
    return await this.notificationsGateway.sendNotificationToUser(notification);
  }

  /**
   * Envoie une mise à jour de statut de notification
   * @returns null si succès, string avec message d'erreur sinon
   */
  async sendNotificationUpdate(
    notification: NotificationData,
  ): Promise<string | null> {
    return await this.notificationsGateway.sendNotificationUpdate(notification);
  }
}

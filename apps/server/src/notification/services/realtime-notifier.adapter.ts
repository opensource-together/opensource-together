import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationData } from './notification.service.interface';
import { NotificationsGateway } from '../gateways/notifications.gateway';
import {
  NOTIFICATION_GATEWAY,
  NotificationGatewayInterface,
} from './notification.gateway.interface';

/**
 * Adapter pour l'envoi de notifications en temps réel via WebSocket.
 * Fait le lien entre le service de notifications et le gateway WebSocket.
 */
@Injectable()
export class RealtimeNotifierAdapter {
  constructor(
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationGatewayInterface,
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


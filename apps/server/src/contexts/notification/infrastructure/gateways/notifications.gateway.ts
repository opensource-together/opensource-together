import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  NotificationData,
} from '../../use-cases/ports/notification.service.port';
import {
  WebSocketAuthService,
  AuthenticatedSocket,
} from '@/auth/web-socket/websocket-auth.service';
import { WebSocketConnectionManager } from './websocket-connection.manager';

/**
 * Gateway WebSocket pour les notifications en temps réel.
 * Responsabilités :
 * - Gérer les connexions/déconnexions WebSocket
 * - Exposer les handlers d'événements authentifiés
 * - Déléguer l'envoi de notifications au service approprié
 */
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: '*',
  },
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
    private readonly webSocketAuthService: WebSocketAuthService,
    private readonly connectionManager: WebSocketConnectionManager,
  ) {
    console.log('NotificationsGateway constructor called'); // ← mets des logs ici
  }

  /**
   * Gère la connexion d'un client WebSocket
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const userId = await this.webSocketAuthService.authenticateSocket(client);

      if (!userId) {
        this.logger.warn('Client non authentifié, déconnexion...');
        console.log('Client non authentifié, déconnexion...');
        client.disconnect();
        return;
      }

      // Enregistrer la connexion
      this.connectionManager.registerConnection(userId, client);

      // Envoyer les notifications non lues
      await this.sendUnreadNotifications(userId, client);
    } catch (error) {
      this.logger.error('Erreur lors de la connexion:', error);
      client.disconnect();
    }
  }

  /**
   * Gère la déconnexion d'un client WebSocket
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    const userId = this.connectionManager.findUserIdBySocketId(client.id);
    if (userId) {
      this.connectionManager.unregisterConnection(userId);
    }
  }

  /**
   * Handler pour demander le rafraîchissement des notifications non lues
   */
  @SubscribeMessage('refresh-unread')
  async handleRefreshUnread(
    @ConnectedSocket() client: AuthenticatedSocket,
  ): Promise<void> {
    const userId = client.userId;
    if (!userId) {
      this.logger.warn('Tentative de rafraîchissement sans userId');
      return;
    }

    await this.sendUnreadNotifications(userId, client);
  }

  /**
   * Envoie une notification à un utilisateur spécifique (appelé par RealtimeNotifierAdapter)
   */
  sendNotificationToUser(notification: NotificationData): void {
    const userSocket = this.connectionManager.getUserSocket(
      notification.userId,
    );

    if (userSocket) {
      userSocket.emit('new-notification', {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        payload: notification.payload,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });

      this.logger.log(
        `Notification envoyée à l'utilisateur ${notification.userId}: ${notification.type} (ID: ${notification.id})`,
      );
    } else {
      this.logger.warn(
        `Utilisateur ${notification.userId} non connecté, notification non envoyée en temps réel`,
      );
    }
  }

  /**
   * Envoie une mise à jour de statut de notification
   */
  sendNotificationUpdate(notification: NotificationData): void {
    const userSocket = this.connectionManager.getUserSocket(
      notification.userId,
    );

    if (userSocket) {
      userSocket.emit('notification-update', {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        payload: notification.payload,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });

      this.logger.log(
        `Mise à jour de notification envoyée à l'utilisateur ${notification.userId}: ${notification.type} (ID: ${notification.id})`,
      );
    }
  }

  /**
   * Méthodes utilitaires pour la surveillance
   */
  getConnectedUsersCount(): number {
    return this.connectionManager.getConnectedUsersCount();
  }

  isUserConnected(userId: string): boolean {
    return this.connectionManager.isUserConnected(userId);
  }

  /**
   * Envoie les notifications non lues à un utilisateur
   */
  private async sendUnreadNotifications(
    userId: string,
    client: AuthenticatedSocket,
  ): Promise<void> {
    try {
      const result =
        await this.notificationService.getUnreadNotifications(userId);

      if (result.success) {
        client.emit('unread-notifications', result.value);
        this.logger.log(
          `${result.value.length} notification(s) non lue(s) envoyée(s) à l'utilisateur ${userId}`,
        );
      } else {
        this.logger.error(
          `Erreur lors de la récupération des notifications pour l'utilisateur ${userId}: ${result.error}`,
        );
      }
    } catch (error) {
      this.logger.error(
        "Erreur lors de l'envoi des notifications non lues:",
        error,
      );
    }
  }
}

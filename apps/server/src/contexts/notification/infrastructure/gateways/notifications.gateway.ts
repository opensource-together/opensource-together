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
  private readonly connectingClients = new Set<string>(); // Pour éviter les connexions multiples

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
    // Éviter les appels multiples pour le même client
    if (this.connectingClients.has(client.id)) {
      return;
    }

    this.connectingClients.add(client.id);

    try {
      const userId = await this.webSocketAuthService.authenticateSocket(client);

      if (!userId) {
        client.disconnect();
        return;
      }

      // Enregistrer la connexion
      this.connectionManager.registerConnection(userId, client);

      // Envoyer les notifications non lues
      await this.sendUnreadNotifications(userId, client);
    } catch (error) {
      client.disconnect();
    } finally {
      // Nettoyer le Set après traitement
      this.connectingClients.delete(client.id);
    }
  }

  /**
   * Gère la déconnexion d'un client WebSocket
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    // Nettoyer le Set des connexions en cours (au cas où)
    this.connectingClients.delete(client.id);

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
      notification.receiverId,
    );

    if (userSocket) {
      userSocket.emit('new-notification', {
        id: notification.id,
        receiverId: notification.receiverId,
        type: notification.type,
        payload: notification.payload,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });

      this.logger.log(
        `Notification envoyée à l'utilisateur ${notification.receiverId}: ${notification.type} (ID: ${notification.id})`,
      );
    } else {
      this.logger.warn(
        `Utilisateur ${notification.receiverId} non connecté, notification non envoyée en temps réel`,
      );
    }
  }

  /**
   * Envoie une mise à jour de statut de notification
   */
  sendNotificationUpdate(notification: NotificationData): void {
    const userSocket = this.connectionManager.getUserSocket(
      notification.receiverId,
    );

    if (userSocket) {
      userSocket.emit('notification-update', {
        id: notification.id,
        receiverId: notification.receiverId,
        type: notification.type,
        payload: notification.payload,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });

      this.logger.log(
        `Mise à jour de notification envoyée à l'utilisateur ${notification.receiverId}: ${notification.type} (ID: ${notification.id})`,
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
        console.log(
          `📬 ${result.value.length} notification(s) non lue(s) envoyées à ${userId}`,
        );
      } else {
        console.log(
          `❌ Erreur récupération notifications pour ${userId}: ${result.error}`,
        );
      }
    } catch (error) {
      console.log(`💥 Erreur envoi notifications non lues:`, error.message);
    }
  }
}

import { AuthenticatedSocket, WebSocketAuthService } from '@/auth/web-socket';
import { Result } from '@/libs/result';
import { Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  NOTIFICATION_SERVICE,
  NotificationServiceInterface,
  NotificationData,
} from '../services';
import { WebSocketConnectionManager } from './websocket-connection.manager';
import { NotificationGatewayInterface } from '../services/notification.gateway.interface';

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
  implements
    OnGatewayConnection,
    OnGatewayDisconnect,
    NotificationGatewayInterface
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly connectingClients = new Set<string>(); // Pour éviter les connexions multiples

  constructor(
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: NotificationServiceInterface,
    private readonly webSocketAuthService: WebSocketAuthService,
    private readonly connectionManager: WebSocketConnectionManager,
  ) {
    this.logger.log('NotificationsGateway constructor called');
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
      this.logger.error(
        `Erreur lors de la connexion du client ${client.id}: ${error}`,
      );
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
   * @returns null si succès, string avec message d'erreur sinon
   */
  async sendNotificationToUser(
    notification: NotificationData,
  ): Promise<string | null> {
    // Vérifier que l'utilisateur a une socket active
    const userSocket = this.connectionManager.getUserSocket(
      notification.receiverId,
    );

    if (userSocket) {
      userSocket.emit('new-notification', {
        object: notification.object,
        id: notification.id,
        receiverId: notification.receiverId,
        senderId: notification.senderId,
        type: notification.type,
        payload: notification.payload,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });

      this.logger.log(
        `✅ Notification envoyée à l'utilisateur ${notification.receiverId}: ${notification.type} (ID: ${notification.id})`,
      );
      return null; // Succès
    } else {
      const warningMessage = `L'utilisateur ${notification.receiverId} existe mais n'est pas connecté via WebSocket`;
      this.logger.warn(
        `⚠️ ${warningMessage}. Notification non envoyée en temps réel.`,
      );
      return warningMessage;
    }
  }

  /**
   * Envoie une mise à jour de statut de notification
   * @returns null si succès, string avec message d'erreur sinon
   */
  async sendNotificationUpdate(
    notification: NotificationData,
  ): Promise<string | null> {
    // Vérifier que l'utilisateur a une socket active
    const userSocket = this.connectionManager.getUserSocket(
      notification.receiverId,
    );

    if (userSocket) {
      userSocket.emit('notification-read', {
        object: notification.object,
        id: notification.id,
        receiverId: notification.receiverId,
        senderId: notification.senderId,
        type: notification.type,
        payload: notification.payload,
        createdAt: notification.createdAt,
        readAt: notification.readAt,
      });

      this.logger.log(
        `✅ Mise à jour de notification envoyée à l'utilisateur ${notification.receiverId}: ${notification.type} (ID: ${notification.id})`,
      );
      return null; // Succès
    } else {
      const warningMessage = `L'utilisateur ${notification.receiverId} existe mais n'est pas connecté via WebSocket`;
      this.logger.warn(
        `⚠️ ${warningMessage}. Mise à jour non envoyée en temps réel.`,
      );
      return warningMessage;
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
          `📬 ${result.value.length} notification(s) non lue(s) envoyées à ${userId}`,
        );
      } else {
        this.logger.error(
          `❌ Erreur récupération notifications pour ${userId}: ${result.error}`,
        );
      }
    } catch (error) {
      this.logger.error(`💥 Erreur envoi notifications non lues: ${error}`);
    }
  }
}

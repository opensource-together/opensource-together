import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  NotificationData,
} from '../../use-cases/ports/notification.service.port';

/**
 * Gateway WebSocket pour les notifications en temps réel.
 * Gère les connexions clients et l'envoi de notifications.
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
  private userSockets = new Map<string, Socket>();

  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
  ) {}

  /**
   * Gère la connexion d'un client WebSocket.
   * Enregistre le socket pour l'utilisateur et envoie les notifications non lues.
   */
  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;

      if (!userId) {
        this.logger.warn('Client connecté sans userId, déconnexion...');
        client.disconnect();
        return;
      }

      // Enregistrer le socket pour cet utilisateur
      this.userSockets.set(userId, client);
      this.logger.log(`Utilisateur ${userId} connecté (Socket: ${client.id})`);

      // Envoyer les notifications non lues à l'utilisateur
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
      this.logger.error('Erreur lors de la connexion:', error);
      client.disconnect();
    }
  }

  /**
   * Gère la déconnexion d'un client WebSocket.
   */
  handleDisconnect(client: Socket) {
    const userId = Array.from(this.userSockets.entries()).find(
      ([, socket]) => socket.id === client.id,
    )?.[0];

    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(
        `Utilisateur ${userId} déconnecté (Socket: ${client.id})`,
      );
    }
  }

  /**
   * Envoie une notification à un utilisateur spécifique.
   */
  async emitToUser(notification: NotificationData) {
    console.log('notification', notification);
    const userSocket = this.userSockets.get(notification.userId);

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
        `Notification sent to user ${notification.userId}: ${notification.type} (ID: ${notification.id})`,
      );
    } else {
      this.logger.warn(
        `User ${notification.userId} not connected, notification not sent in real-time`,
      );
    }
  }

  /**
   * Envoie une mise à jour d'état de notification à un utilisateur.
   */
  async emitNotificationUpdate(notification: NotificationData) {
    const userSocket = this.userSockets.get(notification.userId);

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
        `Notification update sent to user ${notification.userId}: ${notification.type} (ID: ${notification.id}) - Read: ${notification.readAt !== null}`,
      );
    } else {
      this.logger.warn(
        `User ${notification.userId} not connected, notification update not sent in real-time`,
      );
    }
  }

  /**
   * Méthode utilitaire pour obtenir le nombre d'utilisateurs connectés.
   */
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Méthode utilitaire pour vérifier si un utilisateur est connecté.
   */
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  /**
   * Méthode pour envoyer une notification à tous les utilisateurs connectés.
   */
  async broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`Broadcast sent to all connected users: ${event}`);
  }

  /**
   * Envoie directement une notification basique sans persistance.
   * Utile pour des notifications temporaires ou des alertes système.
   */
  async sendDirectNotification(
    userId: string,
    type: string,
    payload: Record<string, unknown>,
  ) {
    const userSocket = this.userSockets.get(userId);

    if (userSocket) {
      userSocket.emit('direct-notification', {
        type: type,
        payload: payload,
        timestamp: new Date(),
      });

      this.logger.log(`Direct notification sent to user ${userId}: ${type}`);
    }
  }
}

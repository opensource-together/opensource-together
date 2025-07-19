import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  NotificationData,
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
} from '@/notification/use-cases/ports/notification.service.port';

/**
 * Gateway WebSocket pour les notifications temps réel.
 *
 * Responsabilités :
 * - Gérer les connexions/déconnexions des clients
 * - Authentifier les utilisateurs via token
 * - Organiser les clients en "rooms" par userId
 * - Émettre des notifications vers les bons utilisateurs
 * - Envoyer les notifications non lues lors de la reconnexion
 */
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications', // URL : ws://localhost:3001/notifications
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
  ) {}

  /**
   * Appelé quand un client se connecte au WebSocket.
   * On récupère le userId depuis le token et on join sa room.
   * On envoie ensuite toutes les notifications non lues.
   */
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      // TODO: Extraire le userId du token d'authentification
      const userId = await this.authenticateSocket(client);

      if (!userId) {
        client.disconnect();
        return;
      }

      // Rejoindre la room personnelle de l'utilisateur
      const roomName = `${userId}`;
      await client.join(roomName);

      // Stocker le userId dans le socket pour usage ultérieur
      client.data.userId = userId;

      this.logger.log(`User ${userId} connected to notifications`);

      // Optionnel : envoyer un message de confirmation
      client.emit('connected', {
        message: 'Notifications WebSocket connected',
      });

      // 🆕 NOUVEAU : Envoyer automatiquement les notifications non lues
      await this.sendUnreadNotifications(client, userId);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  /**
   * Appelé quand un client se déconnecte.
   */
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.logger.log(`User ${userId} disconnected from notifications`);
    }
  }

  /**
   * Envoie une notification à un utilisateur spécifique.
   * Appelé par le RealtimeNotifierAdapter.
   */
  async emitToUser(notification: NotificationData) {
    const roomName = `${notification.userId}`;
    console.log('roomName', roomName);

    console.log('Read value', notification.readAt?.toISOString());
    // Émettre vers tous les clients dans la room de cet utilisateur
    // (un user peut avoir plusieurs onglets ouverts)
    this.server.to(roomName).emit('notification', {
      id: notification.id, // 🆕 NOUVEAU : Inclure l'ID de la notification
      type: notification.type,
      payload: notification.payload,
      createdAt: notification.createdAt.toISOString(),
      readAt: notification.readAt
        ? notification.readAt.toISOString()
        : 'unread', // 🆕 NOUVEAU : Inclure l'état de lecture
    });

    this.logger.log(
      `Notification sent to user ${notification.userId}: ${notification.type} (ID: ${notification.id})`,
    );
  }

  /**
   * 🆕 NOUVEAU : Émet une mise à jour d'état de notification à un utilisateur spécifique.
   * Utilisé quand une notification est marquée comme lue/non lue.
   */
  async emitNotificationUpdate(notification: NotificationData) {
    const roomName = `${notification.userId}`;

    // Émettre un événement spécifique pour les mises à jour d'état
    this.server.to(roomName).emit('notification-updated', {
      id: notification.id,
      type: notification.type,
      payload: notification.payload,
      createdAt: notification.createdAt.toISOString(),
      readAt: notification.readAt?.toISOString() || null,
      isRead: notification.readAt !== null,
    });

    this.logger.log(
      `Notification update sent to user ${notification.userId}: ${notification.type} (ID: ${notification.id}) - Read: ${notification.readAt !== null}`,
    );
  }

  // async markNotificationAsRead(notificationId: string) {
  //   await this.notificationService.markNotificationAsRead(notificationId);
  // }

  /**
   * 🆕 NOUVEAU : Envoie toutes les notifications non lues à un utilisateur qui vient de se connecter.
   * @param client - Socket du client
   * @param userId - ID de l'utilisateur
   */
  private async sendUnreadNotifications(client: Socket, userId: string) {
    try {
      const result =
        await this.notificationService.getUnreadNotifications(userId);

      if (result.success && result.value.length > 0) {
        this.logger.log(
          `Sending ${result.value.length} unread notifications to user ${userId}`,
        );

        // Envoyer chaque notification non lue individuellement
        for (const notification of result.value) {
          client.emit('notification', {
            id: notification.id,
            type: notification.type,
            payload: notification.payload,
            createdAt: notification.createdAt.toISOString(),
            readAt: notification.readAt
              ? notification.readAt.toISOString()
              : 'unread', // Flag pour indiquer que c'est une notification historique
            isHistorical: true, // Flag pour indiquer que c'est une notification historique
          });
        }

        // Envoyer un événement spécial pour indiquer la fin du chargement des notifications historiques
        client.emit('notifications-sync-complete', {
          count: result.value.length,
          message: `${result.value.length} notification(s) non lue(s) synchronisée(s)`,
        });
      } else if (result.success) {
        // Aucune notification non lue
        client.emit('notifications-sync-complete', {
          count: 0,
          message: 'Aucune notification non lue',
        });
      } else {
        // Erreur lors de la récupération
        this.logger.error(
          `Erreur lors de la récupération des notifications pour l'utilisateur ${userId}: ${result.error}`,
        );
        client.emit('notifications-sync-error', {
          message: 'Erreur lors de la synchronisation des notifications',
        });
      }
    } catch (error) {
      this.logger.error(
        `Erreur lors de l'envoi des notifications non lues pour l'utilisateur ${userId}:`,
        error,
      );
      client.emit('notifications-sync-error', {
        message: 'Erreur lors de la synchronisation des notifications',
      });
    }
  }

  /**
   * Authentifie le socket et retourne le userId.
   * TODO: Implémenter l'authentification réelle avec SuperTokens.
   */
  private async authenticateSocket(client: Socket): Promise<string | null> {
    try {
      // Récupérer le token depuis les headers ou query params
      const token = client.handshake.auth.token || client.handshake.query.token;

      if (!token) {
        this.logger.warn('No token provided for WebSocket connection');
        return null;
      }

      // TODO: Valider le token avec SuperTokens
      // const session = await verifySession(token);
      // return session.userId;

      // Pour le moment, on simule (à remplacer par la vraie auth)
      this.logger.warn('Using mock authentication for WebSocket');
      return 'mock_user_id'; // À remplacer !
    } catch (error) {
      this.logger.error('Authentication failed:', error);
      return null;
    }
  }
}

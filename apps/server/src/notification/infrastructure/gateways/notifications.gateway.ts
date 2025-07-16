import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { SendNotificationPayload } from '../../ports/notification.service.port';

/**
 * Gateway WebSocket pour les notifications temps réel.
 *
 * Responsabilités :
 * - Gérer les connexions/déconnexions des clients
 * - Authentifier les utilisateurs via token
 * - Organiser les clients en "rooms" par userId
 * - Émettre des notifications vers les bons utilisateurs
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

  /**
   * Appelé quand un client se connecte au WebSocket.
   * On récupère le userId depuis le token et on join sa room.
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
  async emitToUser(userId: string, notification: SendNotificationPayload) {
    const roomName = `${userId}`;
    console.log('roomName', roomName);

    // Émettre vers tous les clients dans la room de cet utilisateur
    // (un user peut avoir plusieurs onglets ouverts)
    this.server.to(roomName).emit('notification', {
      id: `notif_${Date.now()}`, // ID temporaire
      type: notification.type,
      payload: notification.payload,
      createdAt: new Date().toISOString(),
    });

    this.logger.log(
      `Notification sent to user ${userId}: ${notification.type}`,
    );
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

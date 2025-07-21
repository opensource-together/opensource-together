import { OnModuleInit, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  cors: { origin: ['http://localhost:3000'] },
})
export class NotificationsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<string, Socket>();
  // Map temporaire : wsToken -> { userId, expiresAt }
  private static wsTokens = new Map<
    string,
    { userId: string; expiresAt: number }
  >();
  private static WS_TOKEN_TTL = 6000 * 1000; // 1 minute

  // Méthode à appeler dans un controller HTTP protégé (cookie httpOnly)
  static generateWsToken(userId: string): string {
    const token = uuidv4();
    const expiresAt = Date.now() + NotificationsGateway.WS_TOKEN_TTL;
    NotificationsGateway.wsTokens.set(token, { userId, expiresAt });
    console.log('Generated wsToken:', token);
    const entry = NotificationsGateway.wsTokens.get(token);
    console.log('Validating wsToken:', token);
    console.log('Entry:', entry);
    return token;
  }

  // Validation du ws-token à la connexion WebSocket
  private static validateWsToken(token: string): string | null {
    const entry = NotificationsGateway.wsTokens.get(token);
    console.log('Validating wsToken:', token);
    console.log('Entry:', entry);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      NotificationsGateway.wsTokens.delete(token);
      return null;
    }
    // NE SUPPRIME PLUS ICI
    return entry.userId;
  }

  onModuleInit() {
    this.server.use((socket: Socket, next) => {
      // Le client doit envoyer le ws-token dans la query string ou header
      const wsToken =
        (socket.handshake.query['wsToken'] as string) ||
        socket.handshake.headers['x-ws-token'];
      if (!wsToken) {
        return next(new Error('No ws-token provided'));
      }
      const userId = NotificationsGateway.validateWsToken(wsToken as string);
      if (!userId) {
        return next(new Error('Invalid or expired ws-token'));
      }
      (socket as Record<string, any>).userId = userId;
      // On stocke le token sur le socket pour suppression après connexion
      (socket as Record<string, any>)._wsToken = wsToken;
      next();
    });

    this.server.on('connection', (socket: Socket) => {
      const userId = (socket as Record<string, any>).userId;
      const wsToken = (socket as Record<string, any>)._wsToken;
      if (userId) {
        this.userSockets.set(userId, socket);
        this.logger.log(`User ${userId} connecté: ${socket.id}`);
        // SUPPRESSION DU TOKEN APRÈS CONNEXION EFFECTIVE
        if (wsToken) {
          NotificationsGateway.wsTokens.delete(wsToken);
        }
        socket.on('disconnect', () => {
          this.userSockets.delete(userId);
          this.logger.log(`User ${userId} déconnecté`);
        });
      } else {
        this.logger.warn(`Connexion sans userId: ${socket.id}`);
      }
    });
  }

  // Exemple d'endpoint HTTP à placer dans un controller protégé (cookie httpOnly)
  // @Post('/ws-token')
  // getWsToken(@Req() req) {
  //   const userId = req.user.id; // ou req.session.getUserId() selon ton guard
  //   return { wsToken: NotificationsGateway.generateWsToken(userId) };
  // }

  @SubscribeMessage('notification')
  onNotification(@MessageBody() data: any) {
    this.server.emit('notification', data);
    this.logger.log(`Broadcast notification: ${JSON.stringify(data)}`);
  }

  @SubscribeMessage('ping')
  onPing(@ConnectedSocket() client: Socket) {
    this.logger.log(`Ping reçu de ${client.id}`);
    client.emit('pong', {
      message: 'pong',
      timestamp: new Date().toISOString(),
    });
  }

  emitToUser(userId: string, payload: any) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit('notification', payload);
      this.logger.log(`Notification envoyée à ${userId}`);
    } else {
      this.logger.warn(`User ${userId} non connecté`);
    }
  }

  emitNotificationUpdate(userId: string, payload: any) {
    const socket = this.userSockets.get(userId);
    if (socket) {
      socket.emit('notification-update', payload);
      this.logger.log(`Notification update envoyée à ${userId}`);
    } else {
      this.logger.warn(`User ${userId} non connecté`);
    }
  }
}

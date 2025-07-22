import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsJwtService } from './jwt/ws-jwt.service';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@Injectable()
export class WebSocketAuthService {
  private readonly logger = new Logger(WebSocketAuthService.name);

  constructor(private readonly wsJwtService: WsJwtService) {}

  /**
   * Authentifie un client WebSocket et injecte userId dans le socket
   */
  async authenticateSocket(client: Socket): Promise<string | null> {
    try {
      const token = this.extractTokenFromHandshake(client);
      if (!token) {
        this.logger.warn('Token manquant lors de la connexion WebSocket');
        return null;
      }

      const userId = await this.wsJwtService.verifyToken(token);
      (client as AuthenticatedSocket).userId = userId;
      return userId;
    } catch (error) {
      this.logger.error("Erreur d'authentification WebSocket:", error);
      return null;
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // Query parameter x-ws-token
    if (
      client.handshake?.headers?.['x-ws-token'] &&
      typeof client.handshake.headers['x-ws-token'] === 'string'
    ) {
      return client.handshake.headers['x-ws-token'];
    }

    // Authorization header
    if (
      client.handshake?.headers?.authorization &&
      typeof client.handshake.headers.authorization === 'string'
    ) {
      const [type, token] = client.handshake.headers.authorization.split(' ');
      return type === 'Bearer' ? token : undefined;
    }

    return undefined;
  }
}

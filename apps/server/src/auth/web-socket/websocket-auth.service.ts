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
      // Vérifier si le socket est déjà authentifié
      const existingUserId = (client as AuthenticatedSocket).userId;
      if (existingUserId) {
        return existingUserId;
      }

      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        return null;
      }

      const userId = await this.wsJwtService.verifyToken(token);

      (client as AuthenticatedSocket).userId = userId;
      return userId;
    } catch {
      return null;
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // 1. D'abord chercher dans les query parameters (priorité)
    const queryToken = client.handshake?.query?.['x-ws-token'];
    if (queryToken) {
      // Gérer le cas où le query param est un array (comportement Socket.IO)
      const token = Array.isArray(queryToken) ? queryToken[0] : queryToken;
      if (typeof token === 'string' && token.trim() !== '') {
        return token;
      }
    }

    // 2. Ensuite dans les headers (fallback)
    if (
      client.handshake?.headers?.['x-ws-token'] &&
      typeof client.handshake.headers['x-ws-token'] === 'string'
    ) {
      return client.handshake.headers['x-ws-token'];
    }

    // 3. Authorization header (Bearer token)
    if (
      client.handshake?.headers?.authorization &&
      typeof client.handshake.headers.authorization === 'string'
    ) {
      const [type, token] = client.handshake.headers.authorization.split(' ');
      if (type === 'Bearer') {
        return token;
      }
    }

    return undefined;
  }
}

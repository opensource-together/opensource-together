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
   * Génère un token JWT pour les connexions WebSocket
   */
  async generateToken(userId: string): Promise<string> {
    return this.wsJwtService.generateToken(userId);
  }

  /**
   * Authentifie un socket client à partir du token
   * @returns userId en cas de succès, null si échec
   */
  async authenticateSocket(
    client: AuthenticatedSocket,
  ): Promise<string | null> {
    try {
      // Extraire le token de l'en-tête
      const token = this.extractToken(client);
      if (!token) {
        this.logger.warn('Tentative de connexion WebSocket sans token');
        return null;
      }

      // Vérifier la validité du token
      const payload = this.wsJwtService.verifyToken(token);
      if (!payload || !payload.userId) {
        this.logger.warn('Token WebSocket invalide ou expiré');
        return null;
      }

      // Attacher l'userId au socket client
      client.userId = payload.userId;
      return payload.userId;
    } catch (error) {
      this.logger.error(`Erreur d'authentification WebSocket: ${error}`);
      return null;
    }
  }

  private extractToken(client: Socket): string | null {
    // Essayer d'extraire depuis les paramètres d'auth
    if (client.handshake.auth && client.handshake.auth.token) {
      return client.handshake.auth.token;
    }

    // Sinon, essayer depuis les headers
    if (client.handshake.headers['x-ws-token']) {
      return client.handshake.headers['x-ws-token'] as string;
    }

    return null;
  }
}


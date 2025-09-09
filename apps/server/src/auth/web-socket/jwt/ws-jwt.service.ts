import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface WsTokenPayload {
  userId: string;
}

@Injectable()
export class WsJwtService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Génère un token JWT pour l'authentification WebSocket
   */
  async generateToken(userId: string): Promise<string> {
    const payload: WsTokenPayload = { userId };
    return this.jwtService.sign(payload);
  }

  /**
   * Vérifie un token JWT pour l'authentification WebSocket
   * @returns Le payload décodé si valide, null sinon
   */
  verifyToken(token: string): WsTokenPayload | null {
    try {
      return this.jwtService.verify<WsTokenPayload>(token);
    } catch (error) {
      return null;
    }
  }
}


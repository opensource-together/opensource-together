import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WsJwtService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Génère un token JWT pour les connexions WebSocket
   */
  async generateToken(userId: string): Promise<string> {
    const payload = {
      sub: userId,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
  }

  /**
   * Vérifie et décode un token JWT WebSocket
   */
  async verifyToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        token,
        {
          secret: process.env.JWT_SECRET,
        },
      );

      return payload.sub;
    } catch {
      throw new Error('Token JWT invalide ou expiré');
    }
  }
}

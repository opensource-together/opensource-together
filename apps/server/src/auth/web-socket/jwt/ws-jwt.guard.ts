import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { WsJwtService } from './ws-jwt.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private wsJwtService: WsJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // WebSocket context
    const client = context
      .switchToWs()
      .getClient<Socket & { userId?: string }>();
    // Token via handshake query ou headers
    const token = this.extractTokenFromHandshake(client);
    console.log('token passe par le guard', token);
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }
    try {
      const userId = await this.wsJwtService.verifyToken(token);
      client.userId = userId;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
    return true;
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    // Prend d'abord query, puis headers
    if (
      client.handshake &&
      client.handshake.query &&
      typeof client.handshake.query['x-ws-token'] === 'string'
    ) {
      return client.handshake.query['x-ws-token'];
    }
    if (
      client.handshake &&
      client.handshake.headers &&
      typeof client.handshake.headers['authorization'] === 'string'
    ) {
      const [type, token] =
        client.handshake.headers['authorization'].split(' ');
      return type === 'Bearer' ? token : undefined;
    }
    return undefined;
  }
}

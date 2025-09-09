import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebSocketAuthService } from './websocket-auth.service';
import { WsJwtService } from './jwt/ws-jwt.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-jwt-secret-should-be-changed',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [WsJwtService, WebSocketAuthService],
  exports: [WsJwtService, WebSocketAuthService],
})
export class WebSocketAuthModule {}


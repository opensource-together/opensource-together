import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WsJwtService } from './jwt/ws-jwt.service';
import { WebSocketAuthService } from './websocket-auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [WsJwtService, WebSocketAuthService],
  exports: [WsJwtService, WebSocketAuthService],
})
export class WebSocketAuthModule {}

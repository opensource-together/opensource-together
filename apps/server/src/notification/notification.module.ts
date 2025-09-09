import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import {
  NotificationService,
  NOTIFICATION_SERVICE,
  RealtimeNotifierAdapter,
} from './services';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { WebSocketConnectionManager } from './gateways/websocket-connection.manager';
import { NotificationController } from './controllers/notification.controller';
import { WebSocketAuthModule } from '../auth/web-socket/websocket-auth.module';

@Module({
  imports: [PrismaModule, WebSocketAuthModule],
  controllers: [NotificationController],
  providers: [
    NotificationsGateway,
    WebSocketConnectionManager,
    RealtimeNotifierAdapter,
    {
      provide: NOTIFICATION_SERVICE,
      useClass: NotificationService,
    },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class NotificationModule {}

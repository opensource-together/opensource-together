// import { Module } from '@nestjs/common';
// import { NotificationsGateway } from './notifications.gateway';
// import { WebSocketConnectionManager } from './websocket-connection.manager';
// import { RealtimeNotifierAdapter } from '../services/realtime-notifier.adapter';
// import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
// import { WebSocketAuthModule } from '@/auth/web-socket/websocket-auth.module';
// import { NotificationService } from '../services/notification.service';
// import { NOTIFICATION_SERVICE_PORT } from '../../use-cases/ports/notification.service.port';

// @Module({
//   imports: [PersistenceInfrastructure, WebSocketAuthModule],
//   providers: [
//     NotificationsGateway,
//     {
//       provide: NOTIFICATION_SERVICE_PORT,
//       useClass: NotificationService,
//     },
//     WebSocketConnectionManager,
//     RealtimeNotifierAdapter,
//   ],
//   exports: [NotificationsGateway, RealtimeNotifierAdapter],
// })
// export class GatewayModule {}

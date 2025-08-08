import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NOTIFICATION_SERVICE_PORT } from '../use-cases/ports/notification.service.port';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';

// Services et adapters
import { NotificationService } from './services/notification.service';

// Gateway WebSocket

// Use cases
import { notificationUseCases } from '../use-cases/notification.use-cases';

// Controller
import { NotificationsController } from './controllers/notifications.controller';
import { WebSocketAuthModule } from '@/auth/web-socket/websocket-auth.module';
import { NotificationsGateway } from './gateways/notifications.gateway';
import { RealtimeNotifierAdapter } from './services/realtime-notifier.adapter';
import { WebSocketConnectionManager } from './gateways/websocket-connection.manager';
import { NOTIFICATION_GATEWAY_PORT } from '../use-cases/ports/notification.gateway.port';
// import { GatewayModule } from './gateways/gateway.module';

/**
 * Module d'infrastructure pour les notifications.
 *
 * Responsabilités :
 * - Fournir l'implémentation du port NotificationServicePort
 * - Configurer les adapters (WebSocket, Email, etc.)
 * - Enregistrer les listeners EventEmitter2
 * - Configurer les command handlers CQRS
 * - Configurer les query handlers CQRS
 */
@Module({
  imports: [
    CqrsModule,
    EventEmitterModule,
    PersistenceInfrastructure,
    WebSocketAuthModule,
    // GatewayModule,
  ],
  providers: [
    // Services core
    {
      provide: NOTIFICATION_SERVICE_PORT,
      useClass: NotificationService,
    },
    {
      provide: NOTIFICATION_GATEWAY_PORT,
      useClass: NotificationsGateway,
    },

    // WebSocket services (sans le gateway qui est déjà déclaré ci-dessus)
    WebSocketConnectionManager,
    RealtimeNotifierAdapter,

    // Use cases (commands et queries)
    ...notificationUseCases,
  ],
  controllers: [NotificationsController],
  exports: [
    NOTIFICATION_SERVICE_PORT,
    NOTIFICATION_GATEWAY_PORT,
    RealtimeNotifierAdapter,
  ],
})
export class NotificationInfrastructure {
  constructor() {
    console.log('NotificationInfrastructure constructor called'); // ← mets des logs ici
  }
}

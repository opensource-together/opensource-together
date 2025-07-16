import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from '@/orm/prisma/prisma.service';
import { NOTIFICATION_SERVICE_PORT } from '../ports/notification.service.port';

// Services et adapters
import { NotificationService } from './services/notification.service';
import { RealtimeNotifierAdapter } from './adapters/realtime-notifier.adapter';

// Gateway WebSocket
import { NotificationsGateway } from './gateways/notifications.gateway';

// Listeners EventEmitter2
import { ProjectListener } from './listeners/project.listener';

// Commands
import { CreateNotificationCommandHandler } from '../use-cases/commands/create-notification.command';

// Controller
import { NotificationsController } from '../notifications.controller';

/**
 * Module d'infrastructure pour les notifications.
 *
 * Responsabilités :
 * - Fournir l'implémentation du port NotificationServicePort
 * - Configurer les adapters (WebSocket, Email, etc.)
 * - Enregistrer les listeners EventEmitter2
 * - Configurer les command handlers CQRS
 */
@Module({
  imports: [
    CqrsModule, // Pour les command handlers
    EventEmitterModule, // Pour les listeners @OnEvent
  ],
  providers: [
    // Services core
    PrismaService,
    {
      provide: NOTIFICATION_SERVICE_PORT,
      useClass: NotificationService,
    },

    // Adapters
    RealtimeNotifierAdapter,

    // Gateway WebSocket
    NotificationsGateway,

    // Listeners EventEmitter2
    ProjectListener,

    // Command handlers CQRS
    CreateNotificationCommandHandler,
  ],
  controllers: [NotificationsController],
  exports: [
    // Exporter le port pour les autres modules
    NOTIFICATION_SERVICE_PORT,

    // Exporter le gateway si d'autres modules veulent l'utiliser directement
    NotificationsGateway,
  ],
})
export class NotificationInfrastructure {}

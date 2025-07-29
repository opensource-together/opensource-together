import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PersistenceInfrastructure } from '@/persistence/persistence.infrastructure';
import { NotificationInfrastructure } from '@/contexts/notification/infrastructure/notification.infrastructure';

// Controllers
import { MessagerieController } from './controllers/messagerie.controller';

// Gateways
import { MessagerieGateway } from './gateways/messagerie.gateway';

// Services
import { MessageService } from './services/message.service';
import { RealtimeMessageNotifierAdapter } from './services/realtime-message-notifier.adapter';

// Listeners
import { MessageEventsListener } from './listeners/message-events.listener';

// Commands
import { SendMessageCommandHandler } from '../use-cases/commands/send-message.command';
import { CreateRoomCommandHandler } from '../use-cases/commands/create-room.command';
import { MarkMessageAsReadCommandHandler } from '../use-cases/commands/mark-message-read.command';

// Queries
import { GetMessagesQueryHandler } from '../use-cases/queries/get-messages.query';
import { GetUserRoomsQueryHandler } from '../use-cases/queries/get-user-rooms.query';

// Ports
import { MESSAGE_SERVICE_PORT } from '../use-cases/ports/message.service.port';
import { MESSAGE_GATEWAY_PORT } from '../use-cases/ports/message.gateway.port';

const messageUseCases = [
  SendMessageCommandHandler,
  CreateRoomCommandHandler,
  MarkMessageAsReadCommandHandler,
  GetMessagesQueryHandler,
  GetUserRoomsQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    EventEmitterModule.forRoot(),
    PersistenceInfrastructure,
    // Import du module de notifications pour accéder au service
    forwardRef(() => NotificationInfrastructure),
  ],
  providers: [
    // 🔌 Use Cases (CQRS)
    ...messageUseCases,

    // 🏭 Services
    {
      provide: MESSAGE_SERVICE_PORT,
      useClass: MessageService,
    },
    RealtimeMessageNotifierAdapter,

    // 🌐 WebSocket
    {
      provide: MESSAGE_GATEWAY_PORT,
      useClass: MessagerieGateway,
    },

    // 🎧 Event Listeners
    MessageEventsListener,
  ],
  controllers: [MessagerieController],
  exports: [
    ...messageUseCases,
    MESSAGE_SERVICE_PORT,
    MESSAGE_GATEWAY_PORT,
    RealtimeMessageNotifierAdapter,
  ],
})
export class MessagerieInfrastructure {}

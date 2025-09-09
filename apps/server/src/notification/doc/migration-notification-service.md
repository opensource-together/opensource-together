# Migration du Service de Notification

Ce document détaille la migration du service de notification de l'ancienne architecture (`server_legacy/src/contexts/notification/`) vers la nouvelle architecture (`server/src/notification/`).

## Résumé des Changements

| Aspect      | Ancienne Architecture                           | Nouvelle Architecture                  |
| ----------- | ----------------------------------------------- | -------------------------------------- |
| Structure   | Architecture en couches avec CQRS               | Architecture Feature-First plus simple |
| Location    | `apps/server_legacy/src/contexts/notification/` | `apps/server/src/notification/`        |
| Pattern     | Command/Query avec Event Emitter                | Service Direct avec Interfaces         |
| Dépendances | Nombreuses dépendances NestJS                   | Dépendances minimales                  |

## Structure des Dossiers

### Ancienne Structure

```
contexts/notification/
├── domain/
│   └── notification.entity.ts
├── infrastructure/
│   ├── controllers/
│   │   ├── dto/
│   │   │   ├── create-notification-request.dto.ts
│   │   │   ├── create-notification-response.dto.ts
│   │   │   └── ...
│   │   └── notifications.controller.ts
│   ├── gateways/
│   │   ├── notifications.gateway.ts
│   │   └── websocket-connection.manager.ts
│   ├── notification.infrastructure.ts
│   └── services/
│       ├── notification.service.ts
│       └── realtime-notifier.adapter.ts
├── notification.interface.ts
└── use-cases/
    ├── commands/
    │   ├── create-notification.command.ts
    │   ├── mark-all-notifications-read.command.ts
    │   └── mark-notification-read.command.ts
    ├── notification.use-cases.ts
    ├── ports/
    │   ├── notification.gateway.port.ts
    │   └── notification.service.port.ts
    └── queries/
        └── get-unread-notifications.query.ts
```

### Nouvelle Structure

```
notification/
├── controllers/
│   ├── dto/
│   │   ├── create-notification.request.dto.ts
│   │   ├── create-notification.response.dto.ts
│   │   └── ...
│   └── notification.controller.ts
├── domain/
│   └── notification.ts
├── gateways/
│   ├── notifications.gateway.ts
│   └── websocket-connection.manager.ts
├── notification.module.ts
└── services/
    ├── index.ts
    ├── notification.gateway.interface.ts
    ├── notification.service.interface.ts
    ├── notification.service.ts
    └── realtime-notifier.adapter.ts
```

## Changements Détaillés

### 1. Simplification du Domain

#### Avant:

```typescript
// notification.entity.ts (ancien)
export class Notification {
  private readonly id?: string;
  private readonly object: string;
  private readonly receiverId: string;
  private readonly senderId: string;
  // ...

  public static create(props: {
    /* ... */
  }): Result<Notification, string> {
    // Validation complexe
  }

  public toPrimitive(): NotificationPrimitive {
    // ...
  }
}
```

#### Après:

```typescript
// notification.ts (nouveau)
export interface NotificationData {
  id?: string;
  object: string;
  receiverId: string;
  senderId: string;
  // ...
}

export function validateNotification(
  notification: Partial<NotificationData>
): ValidationErrors | null {
  // Validation simplifiée
}
```

### 2. Suppression de la Couche CQRS

#### Avant:

```typescript
// create-notification.command.ts (ancien)
export class CreateNotificationCommand implements ICommand {
  constructor(public readonly payload: SendNotificationPayload) {}
}

export class CreateNotificationCommandHandler
  implements ICommandHandler<CreateNotificationCommand>
{
  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort
  ) {}

  async execute(
    command: CreateNotificationCommand
  ): Promise<Result<void, string>> {
    return await this.notificationService.sendNotification(command.payload);
  }
}
```

#### Après:

Appel direct du service depuis le contrôleur:

```typescript
// notification.controller.ts (nouveau)
@Post()
async create(
  @Session() session: UserSession,
  @Body() dto: CreateNotificationRequestDto,
): Promise<CreateNotificationResponseDto> {
  try {
    const result = await this.notificationService.sendNotification({
      object: dto.object,
      receiverId: dto.receiverId,
      senderId: session.user.id,
      type: dto.type,
      payload: dto.payload,
      channels: dto.channels,
    });

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return CreateNotificationResponseDto.success();
  } catch (error) {
    // Gestion d'erreur
  }
}
```

### 3. Interfaces vs Ports

#### Avant:

```typescript
// notification.service.port.ts (ancien)
export const NOTIFICATION_SERVICE_PORT = Symbol("NOTIFICATION_SERVICE_PORT");

export interface NotificationServicePort {
  sendNotification(
    notification: SendNotificationPayload
  ): Promise<Result<void, string>>;
  // ...
}
```

#### Après:

```typescript
// notification.service.interface.ts (nouveau)
export const NOTIFICATION_SERVICE = Symbol("NOTIFICATION_SERVICE");

export interface NotificationServiceInterface {
  sendNotification(
    notification: SendNotificationPayload
  ): Promise<Result<void, string>>;
  // ...
}
```

### 4. Organisation des Imports

#### Avant:

Imports spécifiques et dispersés:

```typescript
import { NOTIFICATION_SERVICE_PORT } from "../../use-cases/ports/notification.service.port";
import { SendNotificationPayload } from "../../use-cases/ports/notification.service.port";
```

#### Après:

Utilisation de fichiers index.ts et d'imports groupés:

```typescript
import {
  NotificationServiceInterface,
  NOTIFICATION_SERVICE,
  SendNotificationPayload,
} from "../services";
```

### 5. WebSocket Authentication

#### Avant:

WebSocket auth intégré dans la couche auth globale

#### Après:

Module WebSocket auth spécifique dans le module auth:

```typescript
// websocket-auth.module.ts (nouveau)
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "default-jwt-secret-should-be-changed",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [WsJwtService, WebSocketAuthService],
  exports: [WsJwtService, WebSocketAuthService],
})
export class WebSocketAuthModule {}
```

### 6. Integration dans le Module Principal

#### Avant:

```typescript
// contexts.module.ts (ancien, simplifié)
@Module({
  imports: [
    // ... autres modules
    NotificationInfrastructure,
    // ... autres modules
  ],
})
export class ContextsModule {}
```

#### Après:

```typescript
// app.module.ts (nouveau)
@Module({
  imports: [
    PrismaModule,
    AuthModule.forRoot(auth),
    FeaturesModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Impacts sur le Code Client

### Avant:

```typescript
// Exemple d'utilisation avec CQRS (ancien)
const command = new CreateNotificationCommand({
  userId: payload.userId,
  type: "project.created",
  payload: {
    projectId: payload.projectId,
    message: `Votre projet a été créé!`,
  },
});
await this.commandBus.execute(command);
```

### Après:

```typescript
// Exemple d'utilisation directe avec le service (nouveau)
const notificationPayload = {
  receiverId: payload.userId,
  senderId: "system",
  object: "Nouveau projet",
  type: "project.created",
  payload: {
    projectId: payload.projectId,
    message: `Votre projet a été créé!`,
  },
};
await this.notificationService.sendNotification(notificationPayload);
```

## Avantages de la Nouvelle Architecture

1. **Structure plus plate**: Moins de niveaux d'indirection
2. **Simplicité**: Élimination de CQRS pour un cas d'usage simple
3. **Modularité**: Le module notification est autonome et peut être utilisé par d'autres services
4. **Cohérence**: Alignement avec les autres modules de la nouvelle architecture
5. **Facilité de test**: Moins de composants à mocker
6. **Transparence**: Le flux d'exécution est plus direct et facile à suivre

## Conclusion

La migration du service notification a permis d'aligner ce composant avec la nouvelle architecture tout en conservant ses fonctionnalités essentielles. La structure plus plate et l'élimination des couches CQRS non nécessaires simplifient la maintenance et l'extension du code.

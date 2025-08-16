# 🚀 Guide WebSocket : Architecture et Implémentation

## 📖 Vue d'ensemble

Ce guide explique comment créer un système WebSocket temps réel (notifications, messagerie, chat, etc.) dans l'architecture clean du projet OpenSource Together. Il se base sur l'implémentation existante du système de notifications.

### 🎯 Ce que vous apprendrez

- Architecture clean pour système WebSocket
- Utilisation d'EventEmitter pour l'event-driven
- Authentification WebSocket avec JWT
- Gestion des connexions temps réel
- Pattern CQRS pour WebSocket
- Synchronisation hors ligne

---

## 🏗️ Architecture Générale

### 📊 Vue d'ensemble des couches

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   REST API      │    │   WebSocket     │                │
│  │   Requests      │    │   Connection    │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                INFRASTRUCTURE LAYER                     │ │
│  │  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │ Controllers   │  │   Gateway    │  │  Listeners   │  │ │
│  │  │    (REST)     │  │ (WebSocket)  │  │  (@OnEvent)  │  │ │
│  │  └───────────────┘  └──────────────┘  └──────────────┘  │ │
│  │                           │                             │ │
│  └───────────────────────────│─────────────────────────────┘ │
│                              │                               │
│  ┌───────────────────────────│─────────────────────────────┐ │
│  │              USE CASES LAYER                            │ │
│  │  ┌──────────────┐     ┌──────────────┐                  │ │
│  │  │   Commands   │     │   Queries    │                  │ │
│  │  │   (CQRS)     │     │   (CQRS)     │                  │ │
│  │  └──────────────┘     └──────────────┘                  │ │
│  │                           │                             │ │
│  └───────────────────────────│─────────────────────────────┘ │
│                              │                               │
│  ┌───────────────────────────│─────────────────────────────┐ │
│  │               DOMAIN LAYER                              │ │
│  │  ┌──────────────┐     ┌──────────────┐                  │ │
│  │  │   Entities   │     │ EventEmitter │                  │ │
│  │  │              │     │   Events     │                  │ │
│  │  └──────────────┘     └──────────────┘                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Flux d'événements

```
1. Action Utilisateur (ex: créer projet)
        ↓
2. REST API → Command Handler
        ↓
3. Logique métier + Sauvegarde DB
        ↓
4. EventEmitter.emit('event.name')
        ↓
5. Listener @OnEvent capte l'événement
        ↓
6. Création Command Notification
        ↓
7. Service persiste + envoie WebSocket
        ↓
8. Gateway diffuse aux clients connectés
        ↓
9. Frontend reçoit notification temps réel
```

---

## 📁 Structure des Fichiers

Voici la structure recommandée pour un contexte WebSocket :

```
src/contexts/[votre-contexte]/
├── domain/
│   └── [entity].entity.ts                 # Entités métier
├── use-cases/
│   ├── commands/
│   │   ├── create-[entity].command.ts     # Commands CQRS
│   │   └── mark-[entity]-read.command.ts
│   ├── queries/
│   │   └── get-[entities].query.ts        # Queries CQRS
│   └── ports/
│       ├── [entity].service.port.ts       # Interface service
│       └── [entity].gateway.port.ts       # Interface gateway
└── infrastructure/
    ├── controllers/
    │   ├── [entity].controller.ts         # REST API
    │   └── dto/                           # DTOs
    ├── gateways/
    │   ├── [entity].gateway.ts            # WebSocket Gateway
    │   └── websocket-connection.manager.ts # Gestion connexions
    ├── listeners/
    │   └── [entity]-notifications.listener.ts # Event Listeners
    ├── services/
    │   ├── [entity].service.ts            # Service métier
    │   └── realtime-notifier.adapter.ts   # Adapter WebSocket
    └── [entity].infrastructure.ts         # Module NestJS
```

---

## 🎯 Étape 1 : Créer l'Entité Domain

### 📄 Fichier : `domain/notification.entity.ts`

```typescript
import { Result } from "@/libs/result";

export type NotificationData = {
  id?: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt?: Date;
  readAt?: Date | null;
};

export class Notification {
  private readonly id?: string;
  private readonly object: string;
  private readonly receiverId: string;
  private readonly senderId: string;
  private readonly type: string;
  private readonly payload: Record<string, unknown>;
  private readonly createdAt: Date;
  private readAt: Date | null;

  private constructor(props: NotificationData) {
    this.id = props.id;
    this.object = props.object;
    this.receiverId = props.receiverId;
    this.senderId = props.senderId;
    this.type = props.type;
    this.payload = props.payload;
    this.createdAt = props.createdAt || new Date();
    this.readAt = props.readAt || null;
  }

  // 🏭 Factory method pour création
  public static create(props: {
    object: string;
    receiverId: string;
    senderId: string;
    type: string;
    payload: Record<string, unknown>;
  }): Result<Notification, string> {
    // Validation métier
    const validation = this.validate(props);
    if (!validation.success) {
      return Result.fail(validation.error);
    }

    return Result.ok(new Notification(props));
  }

  // 🔄 Factory method pour reconstitution depuis DB
  public static reconstitute(
    props: NotificationData
  ): Result<Notification, string> {
    return Result.ok(new Notification(props));
  }

  // ✅ Validation des règles métier
  private static validate(props: {
    object: string;
    receiverId: string;
    senderId: string;
    type: string;
    payload: Record<string, unknown>;
  }): Result<void, string> {
    if (!props.receiverId || props.receiverId.trim() === "") {
      return Result.fail("Receiver ID is required");
    }
    if (!props.senderId || props.senderId.trim() === "") {
      return Result.fail("Sender ID is required");
    }
    if (!props.type || props.type.trim() === "") {
      return Result.fail("Type is required");
    }
    return Result.ok();
  }

  // 📖 Méthodes métier
  public markAsRead(): void {
    this.readAt = new Date();
  }

  public isRead(): boolean {
    return this.readAt !== null;
  }

  public getReceiverId(): string {
    return this.receiverId;
  }

  public toPrimitive(): NotificationData {
    return {
      id: this.id,
      object: this.object,
      receiverId: this.receiverId,
      senderId: this.senderId,
      type: this.type,
      payload: this.payload,
      createdAt: this.createdAt,
      readAt: this.readAt,
    };
  }
}
```

---

## 🎯 Étape 2 : Définir les Ports (Interfaces)

### 📄 Fichier : `use-cases/ports/notification.service.port.ts`

```typescript
import { Result } from "@/libs/result";

export type NotificationChannel = "realtime" | "email";

export interface SendNotificationPayload {
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  channels?: NotificationChannel[];
}

export interface NotificationData {
  id: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
  readAt: Date | null;
}

export interface NotificationServicePort {
  sendNotification(
    notification: SendNotificationPayload
  ): Promise<Result<void, string>>;
  getUnreadNotifications(
    userId: string
  ): Promise<Result<NotificationData[], string>>;
  markNotificationAsRead(notificationId: string): Promise<Result<void, string>>;
  markAllNotificationsAsRead(userId: string): Promise<Result<void, string>>;
}

export const NOTIFICATION_SERVICE_PORT = Symbol("NOTIFICATION_SERVICE_PORT");
```

### 📄 Fichier : `use-cases/ports/notification.gateway.port.ts`

```typescript
export interface NotificationGatewayPort {
  sendNotificationToUser(
    notification: NotificationData
  ): Promise<string | null>;
  sendNotificationUpdate(
    notification: NotificationData
  ): Promise<string | null>;
}

export const NOTIFICATION_GATEWAY_PORT = Symbol("NOTIFICATION_GATEWAY_PORT");
```

---

## 🎯 Étape 3 : Créer les Commands/Queries (CQRS)

### 📄 Fichier : `use-cases/commands/create-notification.command.ts`

```typescript
import { ICommand, ICommandHandler, CommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Result } from "@/libs/result";
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  SendNotificationPayload,
} from "../ports/notification.service.port";

export class CreateNotificationCommand implements ICommand {
  constructor(public readonly payload: SendNotificationPayload) {}
}

@CommandHandler(CreateNotificationCommand)
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
    // 1. Validation avec l'entité domain
    const notificationResult = Notification.create({
      object: command.payload.object,
      receiverId: command.payload.receiverId,
      senderId: command.payload.senderId,
      type: command.payload.type,
      payload: command.payload.payload,
    });

    if (!notificationResult.success) {
      return Result.fail(notificationResult.error);
    }

    // 2. Déléguer au service
    return await this.notificationService.sendNotification(command.payload);
  }
}
```

### 📄 Fichier : `use-cases/queries/get-unread-notifications.query.ts`

```typescript
import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { Result } from "@/libs/result";
import { Notification } from "../../domain/notification.entity";
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
} from "../ports/notification.service.port";

export class GetUnreadNotificationsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUnreadNotificationsQuery)
export class GetUnreadNotificationsQueryHandler
  implements IQueryHandler<GetUnreadNotificationsQuery>
{
  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort
  ) {}

  async execute(
    query: GetUnreadNotificationsQuery
  ): Promise<Result<Notification[], string>> {
    const result = await this.notificationService.getUnreadNotifications(
      query.userId
    );

    if (!result.success) {
      return Result.fail(result.error);
    }

    // Reconstituer les entités domain
    const notifications = result.value.map((data) =>
      Notification.reconstitute(data)
    );

    const validNotifications = notifications
      .filter((n) => n.success)
      .map((n) => n.value);

    return Result.ok(validNotifications);
  }
}
```

---

## 🎯 Étape 4 : Implémenter le Service

### 📄 Fichier : `infrastructure/services/notification.service.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { Result } from "@/libs/result";
import { PrismaService } from "@/persistence/orm/prisma/prisma.service";
import {
  NotificationServicePort,
  SendNotificationPayload,
  NotificationData,
} from "../../use-cases/ports/notification.service.port";
import { RealtimeNotifierAdapter } from "./realtime-notifier.adapter";

@Injectable()
export class NotificationService implements NotificationServicePort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeAdapter: RealtimeNotifierAdapter
  ) {}

  async sendNotification(
    notification: SendNotificationPayload
  ): Promise<Result<void, string>> {
    try {
      // 1. Persister en base de données
      const saved = await this.prisma.notification.create({
        data: {
          object: notification.object,
          receiverId: notification.receiverId,
          senderId: notification.senderId,
          type: notification.type,
          payload: notification.payload,
        },
      });

      // 2. Envoyer via WebSocket (si canal realtime activé)
      if (notification.channels?.includes("realtime")) {
        const notificationData: NotificationData = {
          id: saved.id,
          object: saved.object,
          receiverId: saved.receiverId,
          senderId: saved.senderId,
          type: saved.type,
          payload: saved.payload as Record<string, unknown>,
          createdAt: saved.createdAt,
          readAt: saved.readAt,
        };

        await this.realtimeAdapter.send(notificationData);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to send notification: ${error.message}`);
    }
  }

  async getUnreadNotifications(
    userId: string
  ): Promise<Result<NotificationData[], string>> {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          receiverId: userId,
          readAt: null, // Non lues uniquement
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const notificationData: NotificationData[] = notifications.map((n) => ({
        id: n.id,
        object: n.object,
        receiverId: n.receiverId,
        senderId: n.senderId,
        type: n.type,
        payload: n.payload as Record<string, unknown>,
        createdAt: n.createdAt,
        readAt: n.readAt,
      }));

      return Result.ok(notificationData);
    } catch (error) {
      return Result.fail(
        `Failed to get unread notifications: ${error.message}`
      );
    }
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<Result<void, string>> {
    try {
      const updated = await this.prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      });

      // Notifier via WebSocket de la mise à jour
      const notificationData: NotificationData = {
        id: updated.id,
        object: updated.object,
        receiverId: updated.receiverId,
        senderId: updated.senderId,
        type: updated.type,
        payload: updated.payload as Record<string, unknown>,
        createdAt: updated.createdAt,
        readAt: updated.readAt,
      };

      await this.realtimeAdapter.sendNotificationUpdate(notificationData);

      return Result.ok();
    } catch (error) {
      return Result.fail(
        `Failed to mark notification as read: ${error.message}`
      );
    }
  }

  async markAllNotificationsAsRead(
    userId: string
  ): Promise<Result<void, string>> {
    try {
      await this.prisma.notification.updateMany({
        where: {
          receiverId: userId,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(
        `Failed to mark all notifications as read: ${error.message}`
      );
    }
  }
}
```

---

## 🎯 Étape 5 : Créer l'Adapter WebSocket

### 📄 Fichier : `infrastructure/services/realtime-notifier.adapter.ts`

```typescript
import { Injectable, Inject, forwardRef } from "@nestjs/common";
import {
  NOTIFICATION_GATEWAY_PORT,
  NotificationGatewayPort,
} from "../../use-cases/ports/notification.gateway.port";
import { NotificationData } from "../../use-cases/ports/notification.service.port";

@Injectable()
export class RealtimeNotifierAdapter {
  constructor(
    @Inject(forwardRef(() => NOTIFICATION_GATEWAY_PORT))
    private readonly notificationsGateway: NotificationGatewayPort
  ) {}

  /**
   * Envoie une nouvelle notification via WebSocket
   */
  async send(notification: NotificationData): Promise<string | null> {
    return await this.notificationsGateway.sendNotificationToUser(notification);
  }

  /**
   * Envoie une mise à jour de notification via WebSocket
   */
  async sendNotificationUpdate(
    notification: NotificationData
  ): Promise<string | null> {
    return await this.notificationsGateway.sendNotificationUpdate(notification);
  }
}
```

---

## 🎯 Étape 6 : Implémenter la Gateway WebSocket

### 📄 Fichier : `infrastructure/gateways/websocket-connection.manager.ts`

```typescript
import { Injectable, Logger } from "@nestjs/common";
import { AuthenticatedSocket } from "@/auth/web-socket/websocket-auth.service";

@Injectable()
export class WebSocketConnectionManager {
  private readonly logger = new Logger(WebSocketConnectionManager.name);
  private readonly userSockets = new Map<string, AuthenticatedSocket>();

  /**
   * Enregistre une connexion utilisateur
   */
  registerConnection(userId: string, socket: AuthenticatedSocket): void {
    // Si l'utilisateur était déjà connecté, fermer l'ancienne connexion
    const existingSocket = this.userSockets.get(userId);
    if (existingSocket && existingSocket.id !== socket.id) {
      this.logger.log(`Replacing existing connection for user ${userId}`);
      existingSocket.disconnect();
    }

    this.userSockets.set(userId, socket);
    this.logger.log(`User ${userId} connected with socket ${socket.id}`);
  }

  /**
   * Désenregistre une connexion utilisateur
   */
  unregisterConnection(userId: string): void {
    if (this.userSockets.delete(userId)) {
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  /**
   * Récupère le socket d'un utilisateur
   */
  getUserSocket(userId: string): AuthenticatedSocket | undefined {
    return this.userSockets.get(userId);
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  /**
   * Retourne le nombre d'utilisateurs connectés
   */
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Trouve l'userId à partir du socketId
   */
  findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, socket] of this.userSockets.entries()) {
      if (socket.id === socketId) {
        return userId;
      }
    }
    return undefined;
  }
}
```

### 📄 Fichier : `infrastructure/gateways/notifications.gateway.ts`

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Inject, Logger } from "@nestjs/common";
import {
  NOTIFICATION_SERVICE_PORT,
  NotificationServicePort,
  NotificationData,
} from "../../use-cases/ports/notification.service.port";
import {
  WebSocketAuthService,
  AuthenticatedSocket,
} from "@/auth/web-socket/websocket-auth.service";
import { WebSocketConnectionManager } from "./websocket-connection.manager";
import { QueryBus } from "@nestjs/cqrs";
import { GetUnreadNotificationsQuery } from "../../use-cases/queries/get-unread-notifications.query";

/**
 * Gateway WebSocket pour les notifications en temps réel.
 * Responsabilités :
 * - Gérer les connexions/déconnexions WebSocket
 * - Exposer les handlers d'événements authentifiés
 * - Déléguer l'envoi de notifications au service approprié
 */
@WebSocketGateway({
  cors: {
    credentials: true,
    origin: "*", // ⚠️ À restreindre en production
  },
  namespace: "notifications", // Namespace dédié
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, NotificationGatewayPort
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly connectingClients = new Set<string>();

  constructor(
    @Inject(NOTIFICATION_SERVICE_PORT)
    private readonly notificationService: NotificationServicePort,
    private readonly webSocketAuthService: WebSocketAuthService,
    private readonly connectionManager: WebSocketConnectionManager,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * 🔌 Gère la connexion d'un client WebSocket
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    // Éviter les appels multiples pour le même client
    if (this.connectingClients.has(client.id)) {
      return;
    }

    this.connectingClients.add(client.id);

    try {
      // 1. Authentifier le client
      const userId = await this.webSocketAuthService.authenticateSocket(client);

      if (!userId) {
        this.logger.warn(`Authentication failed for socket ${client.id}`);
        client.disconnect();
        return;
      }

      // 2. Enregistrer la connexion
      this.connectionManager.registerConnection(userId, client);

      // 3. Envoyer les notifications non lues automatiquement
      await this.sendUnreadNotifications(userId, client);

      this.logger.log(`User ${userId} connected successfully`);
    } catch (error) {
      this.logger.error(`Connection error for socket ${client.id}:`, error);
      client.disconnect();
    } finally {
      this.connectingClients.delete(client.id);
    }
  }

  /**
   * 🔌 Gère la déconnexion d'un client WebSocket
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    this.connectingClients.delete(client.id);

    const userId = this.connectionManager.findUserIdBySocketId(client.id);
    if (userId) {
      this.connectionManager.unregisterConnection(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  /**
   * 🔄 Handler pour demander le rafraîchissement des notifications non lues
   */
  @SubscribeMessage("refresh-unread")
  async handleRefreshUnread(
    @ConnectedSocket() client: AuthenticatedSocket
  ): Promise<void> {
    const userId = client.userId;
    if (!userId) {
      this.logger.warn("Tentative de rafraîchissement sans userId");
      return;
    }

    await this.sendUnreadNotifications(userId, client);
  }

  /**
   * 📤 Envoie une notification à un utilisateur spécifique
   * Implémente NotificationGatewayPort
   */
  async sendNotificationToUser(
    notification: NotificationData
  ): Promise<string | null> {
    const userSocket = this.connectionManager.getUserSocket(
      notification.receiverId
    );

    if (!userSocket) {
      this.logger.debug(
        `User ${notification.receiverId} not connected, notification stored only`
      );
      return `User ${notification.receiverId} not connected`;
    }

    try {
      // Envoyer la notification en temps réel
      userSocket.emit("new-notification", notification);

      this.logger.log(
        `Notification sent to user ${notification.receiverId}: ${notification.type}`
      );
      return null; // Succès
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${notification.receiverId}:`,
        error
      );
      return `Failed to send: ${error.message}`;
    }
  }

  /**
   * 🔄 Envoie une mise à jour de notification (ex: marquée comme lue)
   * Implémente NotificationGatewayPort
   */
  async sendNotificationUpdate(
    notification: NotificationData
  ): Promise<string | null> {
    const userSocket = this.connectionManager.getUserSocket(
      notification.receiverId
    );

    if (!userSocket) {
      return `User ${notification.receiverId} not connected`;
    }

    try {
      userSocket.emit("notification-read", notification);
      this.logger.log(
        `Notification update sent to user ${notification.receiverId}`
      );
      return null;
    } catch (error) {
      this.logger.error(`Failed to send notification update:`, error);
      return `Failed to send update: ${error.message}`;
    }
  }

  /**
   * 📊 Métriques de connexion
   */
  getConnectedUsersCount(): number {
    return this.connectionManager.getConnectedUsersCount();
  }

  isUserConnected(userId: string): boolean {
    return this.connectionManager.isUserConnected(userId);
  }

  /**
   * 📬 Envoie les notifications non lues lors de la connexion
   * Garantit la synchronisation hors ligne
   */
  private async sendUnreadNotifications(
    userId: string,
    client: AuthenticatedSocket
  ): Promise<void> {
    try {
      const query = new GetUnreadNotificationsQuery(userId);
      const result = await this.queryBus.execute(query);

      if (result.success && result.value.length > 0) {
        const notifications = result.value.map((n) => n.toPrimitive());

        // Envoyer toutes les notifications non lues
        client.emit("unread-notifications", notifications);

        this.logger.log(
          `Sent ${notifications.length} unread notifications to user ${userId}`
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send unread notifications to user ${userId}:`,
        error
      );
    }
  }
}
```

---

## 🎯 Étape 7 : Créer les Event Listeners

### 📄 Fichier : `infrastructure/listeners/project-notifications.listener.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { CommandBus } from "@nestjs/cqrs";
import { CreateNotificationCommand } from "../../../notification/use-cases/commands/create-notification.command";

/**
 * 🎧 Listener pour les notifications liées aux projets.
 * Transforme les événements métier du contexte project en notifications.
 *
 * 📋 Principe : Chaque contexte a son propre listener pour ses notifications spécifiques.
 */
@Injectable()
export class ProjectNotificationsListener {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * 🎉 Notification de confirmation lors de la création d'un projet
   */
  @OnEvent("project.created")
  async handleProjectCreated(event: {
    projectId: string;
    projectTitle: string;
    ownerId: string;
    ownerName: string;
  }) {
    const command = new CreateNotificationCommand({
      object: "project.created",
      receiverId: event.ownerId,
      senderId: event.ownerId, // L'utilisateur se notifie lui-même
      type: "project.created",
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        message: `Votre projet "${event.projectTitle}" a été créé avec succès !`,
      },
      channels: ["realtime"], // Canal WebSocket
    });

    await this.commandBus.execute(command);
  }

  /**
   * 📝 Notification lors de candidature à un rôle
   */
  @OnEvent("project.role.application.created")
  async handleProjectRoleApplicationCreated(event: {
    projectOwnerId: string;
    applicantId: string;
    applicantName: string;
    projectTitle: string;
    roleName: string;
    applicationId: string;
  }) {
    // Notification pour le propriétaire du projet
    const command = new CreateNotificationCommand({
      object: "project.application.received",
      receiverId: event.projectOwnerId,
      senderId: event.applicantId,
      type: "project.role.application.created",
      payload: {
        applicationId: event.applicationId,
        applicantName: event.applicantName,
        projectTitle: event.projectTitle,
        roleName: event.roleName,
        message: `${event.applicantName} a postulé pour le rôle "${event.roleName}" dans votre projet "${event.projectTitle}"`,
      },
      channels: ["realtime", "email"], // Plusieurs canaux
    });

    await this.commandBus.execute(command);
  }

  /**
   * ✅ Notification d'acceptation de candidature
   */
  @OnEvent("project.role.application.accepted")
  async handleProjectRoleApplicationAccepted(event: {
    applicantId: string;
    projectTitle: string;
    roleName: string;
    projectId: string;
  }) {
    const command = new CreateNotificationCommand({
      object: "project.application.accepted",
      receiverId: event.applicantId,
      senderId: "system", // Notification système
      type: "project.role.application.accepted",
      payload: {
        projectId: event.projectId,
        projectTitle: event.projectTitle,
        roleName: event.roleName,
        message: `Félicitations ! Votre candidature pour le rôle "${event.roleName}" dans le projet "${event.projectTitle}" a été acceptée`,
      },
      channels: ["realtime", "email"],
    });

    await this.commandBus.execute(command);
  }
}
```

---

## 🎯 Étape 8 : Créer les Controllers REST

### 📄 Fichier : `infrastructure/controllers/dto/create-notification-request.dto.ts`

```typescript
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsArray,
  IsOptional,
  IsIn,
} from "class-validator";

export class CreateNotificationRequestDto {
  @IsString()
  @IsNotEmpty()
  object: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  @IsNotEmpty()
  payload: Record<string, unknown>;

  @IsArray()
  @IsOptional()
  @IsIn(["realtime", "email"], { each: true })
  channels?: ("realtime" | "email")[];
}
```

### 📄 Fichier : `infrastructure/controllers/notifications.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Session } from "@/libs/decorators/optional-session.decorator";
import { CreateNotificationRequestDto } from "./dto/create-notification-request.dto";
import { CreateNotificationCommand } from "../../use-cases/commands/create-notification.command";
import { GetUnreadNotificationsQuery } from "../../use-cases/queries/get-unread-notifications.query";
import { MarkNotificationReadCommand } from "../../use-cases/commands/mark-notification-read.command";
import { MarkAllNotificationsReadCommand } from "../../use-cases/commands/mark-all-notifications-read.command";

/**
 * 🎮 Controller REST pour les notifications
 * Expose les APIs publiques pour interaction avec le système de notifications
 */
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * 📤 Créer et envoyer une nouvelle notification
   * POST /notifications
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Session("userId") senderId: string,
    @Body() dto: CreateNotificationRequestDto
  ) {
    const command = new CreateNotificationCommand({
      object: dto.object,
      receiverId: dto.receiverId,
      senderId: senderId,
      type: dto.type,
      payload: dto.payload,
      channels: dto.channels || ["realtime"],
    });

    const result = await this.commandBus.execute(command);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: "Notification créée et envoyée avec succès",
    };
  }

  /**
   * 📬 Récupérer les notifications non lues
   * GET /notifications/unread
   */
  @Get("unread")
  async getUnreadNotifications(@Session("userId") userId: string) {
    const query = new GetUnreadNotificationsQuery(userId);
    const result = await this.queryBus.execute(query);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
        data: [],
        count: 0,
      };
    }

    const notifications = result.value.map((n) => n.toPrimitive());

    return {
      success: true,
      data: notifications,
      count: notifications.length,
    };
  }

  /**
   * ✅ Marquer une notification comme lue
   * PATCH /notifications/:id/read
   */
  @Patch(":id/read")
  async markAsRead(
    @Session("userId") userId: string,
    @Param("id") notificationId: string
  ) {
    const command = new MarkNotificationReadCommand(notificationId, userId);
    const result = await this.commandBus.execute(command);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: "Notification marquée comme lue",
    };
  }

  /**
   * ✅ Marquer toutes les notifications comme lues
   * PATCH /notifications/read-all
   */
  @Patch("read-all")
  async markAllAsRead(@Session("userId") userId: string) {
    const command = new MarkAllNotificationsReadCommand(userId);
    const result = await this.commandBus.execute(command);

    if (!result.success) {
      return {
        success: false,
        message: result.error,
      };
    }

    return {
      success: true,
      message: "Toutes les notifications marquées comme lues",
    };
  }

  /**
   * 🔑 Obtenir un token pour la connexion WebSocket
   * GET /notifications/ws-token
   */
  @Get("ws-token")
  async getWsToken(@Session("userId") userId: string) {
    // Ici vous pourriez utiliser un service JWT dédié
    // const token = await this.wsJwtService.generateToken(userId);

    return {
      wsToken: "your-generated-jwt-token",
      expiresIn: 3600, // 1 heure
      tokenType: "Bearer",
    };
  }
}
```

---

## 🎯 Étape 9 : Émettre des Événements

### 📄 Dans vos Command Handlers métier

```typescript
// Exemple : CreateProjectCommandHandler
@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    @Inject(PROJECT_REPOSITORY_PORT)
    private readonly projectRepo: ProjectRepositoryPort,
    @Inject(EventEmitter2) // 🎯 Injecter EventEmitter
    private readonly eventEmitter: EventEmitter2
  ) {}

  async execute(
    command: CreateProjectCommand
  ): Promise<Result<Project, string>> {
    // 1. Logique métier - créer et sauvegarder le projet
    const projectResult = Project.create({
      ownerId: command.props.ownerId,
      title: command.props.title,
      description: command.props.description,
      // ... autres propriétés
    });

    if (!projectResult.success) {
      return Result.fail(projectResult.error);
    }

    const savedProject = await this.projectRepo.create(projectResult.value);
    if (!savedProject.success) {
      return Result.fail("Unable to create project");
    }

    // 2. 🎉 Émettre l'événement pour déclencher les notifications
    this.eventEmitter.emit("project.created", {
      projectId: savedProject.value.toPrimitive().id,
      projectTitle: savedProject.value.toPrimitive().title,
      ownerId: command.props.ownerId,
      ownerName: "John Doe", // À récupérer depuis le service User
    });

    // 3. Optionnel : Émettre d'autres événements
    this.eventEmitter.emit("project.stats.updated", {
      totalProjects: await this.projectRepo.count(),
    });

    return Result.ok(savedProject.value);
  }
}
```

### 📋 Liste d'événements recommandés

```typescript
// 📋 Événements projets
"project.created"; // Projet créé
"project.updated"; // Projet modifié
"project.deleted"; // Projet supprimé
"project.published"; // Projet publié

// 🎭 Événements rôles
"project.role.application.created"; // Candidature envoyée
"project.role.application.accepted"; // Candidature acceptée
"project.role.application.rejected"; // Candidature refusée
"project.role.assigned"; // Rôle assigné
"project.role.unassigned"; // Rôle désassigné

// 👥 Événements collaboration
"project.member.joined"; // Nouveau membre
"project.member.left"; // Membre parti
"project.invite.sent"; // Invitation envoyée

// 💬 Événements messagerie
"message.received"; // Message reçu
"message.read"; // Message lu
"conversation.created"; // Conversation créée

// ⚙️ Événements système
"system.maintenance"; // Maintenance planifiée
"user.welcome"; // Message de bienvenue
"user.achievement.unlocked"; // Succès débloqué
```

---

## 🎯 Étape 10 : Configurer le Module

### 📄 Fichier : `infrastructure/notification.infrastructure.ts`

```typescript
import { Module, forwardRef } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PersistenceInfrastructure } from "@/persistence/persistence.infrastructure";

// Controllers
import { NotificationsController } from "./controllers/notifications.controller";

// Gateways
import { NotificationsGateway } from "./gateways/notifications.gateway";
import { WebSocketConnectionManager } from "./gateways/websocket-connection.manager";

// Services
import { NotificationService } from "./services/notification.service";
import { RealtimeNotifierAdapter } from "./services/realtime-notifier.adapter";

// Listeners
import { ProjectNotificationsListener } from "./listeners/project-notifications.listener";

// Commands
import {
  CreateNotificationCommand,
  CreateNotificationCommandHandler,
} from "../use-cases/commands/create-notification.command";
import {
  MarkNotificationReadCommand,
  MarkNotificationReadCommandHandler,
} from "../use-cases/commands/mark-notification-read.command";
import {
  MarkAllNotificationsReadCommand,
  MarkAllNotificationsReadCommandHandler,
} from "../use-cases/commands/mark-all-notifications-read.command";

// Queries
import {
  GetUnreadNotificationsQuery,
  GetUnreadNotificationsQueryHandler,
} from "../use-cases/queries/get-unread-notifications.query";

// Ports
import { NOTIFICATION_SERVICE_PORT } from "../use-cases/ports/notification.service.port";
import { NOTIFICATION_GATEWAY_PORT } from "../use-cases/ports/notification.gateway.port";

// Auth (dépendance externe)
import { WebSocketAuthService } from "@/auth/web-socket/websocket-auth.service";
import { WsJwtService } from "@/auth/web-socket/jwt/ws-jwt.service";

const notificationUseCases = [
  CreateNotificationCommandHandler,
  MarkNotificationReadCommandHandler,
  MarkAllNotificationsReadCommandHandler,
  GetUnreadNotificationsQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    PersistenceInfrastructure,
    // ⚠️ Si vous avez des dépendances circulaires, utilisez forwardRef
    // forwardRef(() => OtherModule),
  ],
  providers: [
    // 🔌 Use Cases (CQRS)
    ...notificationUseCases,

    // 🏭 Services
    {
      provide: NOTIFICATION_SERVICE_PORT,
      useClass: NotificationService,
    },
    RealtimeNotifierAdapter,

    // 🌐 WebSocket
    {
      provide: NOTIFICATION_GATEWAY_PORT,
      useClass: NotificationsGateway,
    },
    NotificationsGateway,
    WebSocketConnectionManager,
    WebSocketAuthService,
    WsJwtService,

    // 🎧 Event Listeners
    ProjectNotificationsListener,
    // MessageNotificationsListener, // Ajouter d'autres listeners selon le besoin
    // SystemNotificationsListener,
  ],
  controllers: [NotificationsController],
  exports: [
    ...notificationUseCases,
    NOTIFICATION_SERVICE_PORT,
    NOTIFICATION_GATEWAY_PORT,
    NotificationsGateway, // Export si utilisé dans d'autres modules
  ],
})
export class NotificationInfrastructure {}
```

### 📄 Ajouter au module principal

```typescript
// contexts/contexts.module.ts
@Module({
  imports: [
    // ... autres modules
    EventEmitterModule.forRoot(), // 🎯 Obligatoire pour EventEmitter
    NotificationInfrastructure, // 🔔 Votre nouveau module
  ],
  exports: [
    // ... autres exports
    NotificationInfrastructure,
  ],
})
export class ContextsModule {}
```

---

## 🧪 Tests et Utilisation

### 🔧 Test API REST

```bash
# 1. Créer une notification
POST http://localhost:4000/notifications
Content-Type: application/json

{
  "object": "test.notification",
  "receiverId": "user-123",
  "type": "welcome.message",
  "payload": {
    "message": "Bienvenue sur la plateforme !",
    "actionUrl": "/dashboard"
  },
  "channels": ["realtime"]
}

# 2. Récupérer notifications non lues
GET http://localhost:4000/notifications/unread

# 3. Marquer comme lue
PATCH http://localhost:4000/notifications/{id}/read

# 4. Token WebSocket
GET http://localhost:4000/notifications/ws-token
```

### 🔌 Test WebSocket (Frontend)

```javascript
// 1. Récupérer le token d'authentification
const response = await fetch("/notifications/ws-token");
const { wsToken } = await response.json();

// 2. Se connecter au WebSocket
const socket = io("http://localhost:4000/notifications", {
  query: { "x-ws-token": wsToken },
});

// 3. Événements à écouter
socket.on("connect", () => {
  console.log("✅ Connecté au WebSocket");
});

// 📬 Notifications non lues reçues à la connexion
socket.on("unread-notifications", (notifications) => {
  console.log(
    `📬 ${notifications.length} notification(s) non lue(s):`,
    notifications
  );
  // Afficher dans l'UI
});

// 📩 Nouvelles notifications en temps réel
socket.on("new-notification", (notification) => {
  console.log("📩 Nouvelle notification:", notification);
  // Afficher toast/popup
  showNotificationToast(notification.payload.message);
});

// 🔄 Mises à jour (notification marquée comme lue)
socket.on("notification-read", (notification) => {
  console.log("🔄 Notification marquée comme lue:", notification);
  // Mettre à jour l'état dans l'UI
});

socket.on("disconnect", () => {
  console.log("❌ Déconnecté du WebSocket");
});

// 4. Demander un rafraîchissement manuel
socket.emit("refresh-unread");
```

---

## 🚀 Patterns Avancés

### 🎯 Pattern Multi-Tenancy

```typescript
// Pour un système multi-tenant
@OnEvent('tenant.*.project.created') // Wildcard pour tous les tenants
async handleProjectCreated(event: {
  tenantId: string;
  projectId: string;
  // ...
}) {
  // Logique spécifique au tenant
}
```

### 🎯 Pattern de Notification Groupée

```typescript
// Service pour grouper les notifications
@Injectable()
export class NotificationGroupingService {
  private readonly pendingNotifications = new Map<string, NotificationData[]>();

  async scheduleNotification(notification: NotificationData) {
    const key = `${notification.receiverId}:${notification.type}`;

    if (!this.pendingNotifications.has(key)) {
      this.pendingNotifications.set(key, []);

      // Envoyer après 5 secondes (grouper les notifications similaires)
      setTimeout(() => {
        this.sendGroupedNotifications(key);
      }, 5000);
    }

    this.pendingNotifications.get(key)?.push(notification);
  }

  private async sendGroupedNotifications(key: string) {
    const notifications = this.pendingNotifications.get(key) || [];
    this.pendingNotifications.delete(key);

    if (notifications.length === 1) {
      // Envoyer notification simple
      await this.notificationService.sendNotification(notifications[0]);
    } else {
      // Créer notification groupée
      const groupedNotification = this.createGroupedNotification(notifications);
      await this.notificationService.sendNotification(groupedNotification);
    }
  }
}
```

### 🎯 Pattern de Retry Automatique

```typescript
// Service avec retry automatique
@Injectable()
export class ReliableNotificationService {
  async sendWithRetry(
    notification: NotificationData,
    maxRetries = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.notificationService.sendNotification(notification);
        return; // Succès
      } catch (error) {
        if (attempt === maxRetries) {
          // Envoyer à une queue de dead letter
          await this.deadLetterQueue.add(notification);
          throw error;
        }

        // Attendre avant le retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
}
```

---

## 📊 Monitoring et Métriques

### 🔍 Logger configuré

```typescript
// Logger spécialisé pour les notifications
@Injectable()
export class NotificationLogger {
  private readonly logger = new Logger("NotificationSystem");

  logNotificationSent(notification: NotificationData) {
    this.logger.log(`📤 Notification sent`, {
      id: notification.id,
      type: notification.type,
      receiverId: notification.receiverId,
      channel: "realtime",
    });
  }

  logWebSocketConnection(userId: string, socketId: string) {
    this.logger.log(`🔌 WebSocket connected`, {
      userId,
      socketId,
      timestamp: new Date().toISOString(),
    });
  }

  logError(error: string, context: Record<string, any>) {
    this.logger.error(`❌ Notification error: ${error}`, context);
  }
}
```

### 📈 Métriques d'application

```typescript
// Service de métriques
@Injectable()
export class NotificationMetricsService {
  private notificationsSent = 0;
  private activeConnections = 0;

  incrementNotificationsSent(type: string) {
    this.notificationsSent++;
    // Envoyer à votre système de métriques (Prometheus, etc.)
  }

  setActiveConnections(count: number) {
    this.activeConnections = count;
  }

  getMetrics() {
    return {
      notificationsSent: this.notificationsSent,
      activeConnections: this.activeConnections,
      uptime: process.uptime(),
    };
  }
}
```

---

## ⚠️ Bonnes Pratiques

### ✅ À Faire

1. **Validation stricte** : Toujours valider les données avec l'entité domain
2. **Authentification** : Sécuriser les connexions WebSocket avec JWT
3. **Gestion d'erreurs** : Implémenter un système de retry et dead letter
4. **Logs détaillés** : Logger toutes les actions importantes
5. **Métriques** : Surveiller les performances et l'usage
6. **Tests** : Tester les événements, listeners et WebSocket
7. **Rate limiting** : Limiter le nombre de notifications par utilisateur
8. **Persistance** : Toujours sauvegarder avant d'envoyer via WebSocket

### ❌ À Éviter

1. **Logique métier dans la Gateway** : Garder la gateway simple
2. **Connexions non authentifiées** : Toujours vérifier l'identité
3. **Notifications sans persistance** : Risque de perte de données
4. **Listeners synchrones lourds** : Éviter les opérations lentes
5. **Couplage fort** : Utiliser les événements pour découpler
6. **Pas de gestion hors ligne** : Implémenter la synchronisation
7. **CORS trop permissif** : Restreindre les origines en production
8. **Payload trop large** : Limiter la taille des notifications

---

## 🔧 Extensions Possibles

### 📧 Canal Email

```typescript
// Ajouter un adapter email
@Injectable()
export class EmailNotifierAdapter {
  async send(notification: NotificationData): Promise<void> {
    // Logique d'envoi par email
  }
}

// Dans le service principal
if (notification.channels?.includes("email")) {
  await this.emailAdapter.send(notificationData);
}
```

### 📱 Notifications Push Mobile

```typescript
// Adapter pour push notifications
@Injectable()
export class PushNotifierAdapter {
  async send(notification: NotificationData): Promise<void> {
    // Logique Firebase/APNs
  }
}
```

### 🔕 Préférences Utilisateur

```typescript
// Service de préférences
@Injectable()
export class NotificationPreferencesService {
  async canSendNotification(userId: string, type: string): Promise<boolean> {
    const preferences = await this.getPreferences(userId);
    return preferences.enabledTypes.includes(type);
  }
}
```

---

## 🎉 Conclusion

Ce guide vous donne une architecture complète pour créer des systèmes WebSocket robustes et scalables. Le pattern est réutilisable pour :

- **Notifications** temps réel
- **Messagerie** instantanée
- **Chat** en direct
- **Collaboration** temps réel
- **Mises à jour** de statut
- **Événements** métier

### 🚀 Prochaines étapes recommandées

1. Implémenter le système de base avec ce guide
2. Ajouter les tests unitaires et d'intégration
3. Configurer le monitoring et les alertes
4. Optimiser les performances selon l'usage
5. Étendre avec des canaux supplémentaires (email, push)

L'architecture event-driven avec WebSocket vous permet de créer des applications modernes et réactives tout en gardant un code maintenable et testable ! 🎯

## 🎯 Objectif

Créer un système de notifications push automatisé pour OST, permettant aux utilisateurs de recevoir des alertes temps réel lors d'actions métier importantes.

## 🏗️ Étapes d'Implémentation

### 1. Architecture WebSocket (Transport Layer)

- Gateway Socket.IO : NotificationsGateway
- Namespace : /notifications
- Rooms : segmentation par user\_<userId>
- Handshake : authentification par token
- CORS : configuration multi-origin

### 2. Couche Application (Business Logic)

- CQRS Pattern : CreateNotificationCommand + CommandHandler
- Service Layer : NotificationService (orchestration)
- Repository Pattern : persistance Prisma (Notification table)
- Adapter Pattern : RealtimeNotifierAdapter (découplage)

### 3. Event-Driven Architecture (Automation)

- EventEmitter2 : système de publication/souscription
- Domain Events : project.created, project.role.assigned, project.role.application.created
- Event Listeners : ProjectListener (handlers automatiques)
- Pub/Sub Pattern : découplage émetteurs/consommateurs

### 4. Infrastructure Setup (Configuration)

- Module DI : NotificationInfrastructure
- Controllers : endpoints REST pour tests
- Guards : @PublicAccess() pour bypass auth
- Ports & Adapters : Clean Architecture

## 🎬 Flux de Données Complet

```
1. User Action (CREATE PROJECT)
   ↓
2. HTTP Request → ProjectController
   ↓
3. CQRS → CreateProjectCommandHandler
   ↓
4. Business Logic → Project.create()
   ↓
5. Persistence → ProjectRepository.save()
   ↓
6. Domain Event → eventEmitter.emit('project.created')
   ↓
7. Event Listener → ProjectListener.handleProjectCreated()
   ↓
8. Notification Command → CreateNotificationCommand
   ↓
9. Notification Service → persist + broadcast
   ↓
10. WebSocket Adapter → RealtimeNotifierAdapter
    ↓
11. Gateway Broadcast → NotificationsGateway.emitToUser()
    ↓
12. Client Reception → socket.on('notification')
```

## 🔧 Champs Lexicaux Techniques

- Patterns Architecturaux
- Event-Driven Architecture
- CQRS (Command Query Responsibility Segregation)
- Clean Architecture (Ports & Adapters)
- Repository Pattern
- Adapter Pattern
- Pub/Sub (Publisher-Subscriber)
- Technologies WebSocket
- Socket.IO (WebSocket framework)
- Rooms (segmentation clients)
- Namespace (organisation logique)
- Handshake (authentification initiale)
- Events (messages bidirectionnels)
- Concepts Métier
- Domain Events (événements métier)
- Event Sourcing (traçabilité actions)
- Real-time Push (notifications instantanées)
- Multi-channel (realtime, email, SMS)
- Persistence Layer (historique notifications)

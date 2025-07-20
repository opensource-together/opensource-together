# 🔔 Guide Complet : Système de Notifications

## 📖 Vue d'ensemble

Le système de notifications d'OST utilise une architecture **event-driven** avec WebSocket pour envoyer des notifications temps réel aux utilisateurs. Il suit les principes de la clean architecture avec CQRS.

### 🔑 Prérequis et Connexion

- **Authentification** : L'utilisateur doit avoir un `userId` valide pour recevoir des notifications et doit s'être `connecté` à la socket au moins 1x pour pouvoir en envoyer
- **Connexion WebSocket** : Optionnelle - les notifications sont persistées même si l'utilisateur est hors ligne
- **Synchronisation automatique** : À la reconnexion, toutes les notifications non lues reçues pendant la période hors ligne sont automatiquement envoyées

### 📊 Structure des Données

Chaque notification suit cette structure standardisée :

```typescript
interface NotificationData {
  id: string; // UUID unique de la notification
  userId: string; // ID de l'utilisateur destinataire
  type: string; // Type d'événement (ex: 'project.created')
  payload: Record<string, unknown>; // Données spécifiques à l'événement
  createdAt: Date; // Date de création
  readAt: Date | null; // Date de lecture (null = non lue)
}
```

**Exemple concret** :

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "type": "project.created",
  "payload": {
    "projectId": "project-456",
    "projectTitle": "Mon Super Projet",
    "message": "Votre projet a été créé avec succès !"
  },
  "createdAt": "2024-01-01T10:00:00.000Z",
  "readAt": null
}
```

### 🔄 Gestion Hors Ligne

Le système garantit qu'aucune notification n'est perdue :

1. **Persistance automatique** : Toutes les notifications sont sauvegardées en base de données
2. **État de lecture** : Chaque notification a un statut lu/non lu
3. **Synchronisation à la reconnexion** : Lors de la connexion WebSocket, l'utilisateur reçoit automatiquement toutes ses notifications non lues
4. **Pas de doublons** : Les notifications déjà lues ne sont plus renvoyées

## 🏗️ Architecture du Système

```
Event Business → Event Listener → Notification Command → Service → WebSocket → Client
```

### Composants principaux :

1. **Domain Events** : Événements métier émis lors d'actions importantes
2. **Event Listeners** : Écoutent les événements et déclenchent les notifications
3. **Commands/Queries** : Gèrent la logique applicative des notifications
4. **Service Infrastructure** : Persiste et envoie les notifications
5. **WebSocket Gateway** : Diffuse en temps réel aux clients connectés

## 🎯 Comment Automatiser une Notification

### 1. Émettre l'événement dans votre command handler

```typescript
// Dans votre command handler (ex: CreateProjectCommandHandler)
@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler {
  constructor(
    // ... autres dépendances
    @Inject(EventEmitter2)
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateProjectCommand) {
    // ... logique métier ...

    // ✅ Émettre l'événement
    this.eventEmitter.emit('project.created', {
      projectId: savedProject.value.toPrimitive().id,
      projectTitle: savedProject.value.toPrimitive().title,
      ownerId: ownerId,
      ownerName: 'Demo User', // À remplacer par le vrai nom
    });

    return Result.ok(savedProject.value);
  }
}
```

### 2. Créer le listener pour cet événement

```typescript
// Dans infrastructure/listeners/project.listener.ts
@Injectable()
export class ProjectListener {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent('project.created')
  async handleProjectCreated(payload: {
    projectId: string;
    projectTitle: string;
    ownerId: string;
    ownerName: string;
  }) {
    // Créer la notification
    const command = new CreateNotificationCommand({
      userId: payload.ownerId,
      type: 'project.created',
      payload: {
        projectId: payload.projectId,
        projectTitle: payload.projectTitle,
        ownerName: payload.ownerName,
        message: `Votre projet "${payload.projectTitle}" a été créé avec succès !`,
      },
    });

    await this.commandBus.execute(command);
  }

  @OnEvent('project.role.assigned')
  async handleRoleAssigned(payload: {
    userId: string;
    projectTitle: string;
    roleName: string;
  }) {
    const command = new CreateNotificationCommand({
      userId: payload.userId,
      type: 'project.role.assigned',
      payload: {
        projectTitle: payload.projectTitle,
        roleName: payload.roleName,
        message: `Vous avez été assigné au rôle "${payload.roleName}" dans le projet "${payload.projectTitle}"`,
      },
    });

    await this.commandBus.execute(command);
  }
}
```

### 3. Enregistrer le listener dans le module

```typescript
// Dans notification.infrastructure.ts
@Module({
  providers: [
    // ... autres providers
    ProjectListener, // ✅ Ajouter votre listener
  ],
})
export class NotificationInfrastructure {}
```

## 📋 Méthodes Disponibles

### Commands

#### `CreateNotificationCommand`

```typescript
const command = new CreateNotificationCommand({
  userId: 'user-123', // ID de l'utilisateur destinataire
  type: 'project.created', // Type d'événement
  payload: {
    // Données personnalisées
    projectTitle: 'Mon Projet',
    message: 'Notification personnalisée',
  },
  channels: ['realtime'], // Optionnel : canaux d'envoi
});

await this.commandBus.execute(command);
```

#### `MarkNotificationReadCommand`

```typescript
const command = new MarkNotificationReadCommand('notification-id');
await this.commandBus.execute(command);
```

#### `MarkAllNotificationsReadCommand`

```typescript
const command = new MarkAllNotificationsReadCommand('user-id');
await this.commandBus.execute(command);
```

### Queries

#### `GetUnreadNotificationsQuery`

```typescript
const query = new GetUnreadNotificationsQuery('user-id');
const result = await this.queryBus.execute(query);
// Retourne: Result<Notification[], string>
```

### Conditions d'utilisation

| Méthode                           | Quand l'utiliser                            | Où l'utiliser                       |
| --------------------------------- | ------------------------------------------- | ----------------------------------- |
| `CreateNotificationCommand`       | Envoyer une nouvelle notification           | Event Listeners, Controllers        |
| `MarkNotificationReadCommand`     | Marquer une notification comme lue          | Controllers, API endpoints          |
| `MarkAllNotificationsReadCommand` | Marquer toutes les notifications comme lues | Controllers, paramètres utilisateur |
| `GetUnreadNotificationsQuery`     | Récupérer les notifications non lues        | Controllers, lors de la connexion   |

## 🧪 Guide de Test Step-by-Step

### Étape 1 : Démarrer le serveur

```bash
cd apps/server
npm run dev
```

### Étape 2 : Se connecter au WebSocket

```javascript
// Dans le navigateur ou un client
'http://localhost:4000/notifications?userId=user-123';

// Événements à écouter
socket.on('connect', () => {
  console.log('✅ Connecté au WebSocket');
});

// 📬 Notifications non lues reçues à la connexion (synchronisation)
socket.on('unread-notifications', (notifications) => {
  console.log(
    `📬 ${notifications.length} notification(s) non lue(s) reçue(s):`,
    notifications,
  );
  // Ces notifications ont été créées pendant que l'utilisateur était hors ligne
});

// 📩 Nouvelles notifications en temps réel
socket.on('new-notification', (notification) => {
  console.log('📩 Nouvelle notification temps réel:', notification);
  // Cette notification vient d'être créée
});

// 🔄 Mises à jour d'état (notification marquée comme lue)
socket.on('notification-update', (notification) => {
  console.log('🔄 Notification mise à jour:', notification);
  // notification.readAt sera maintenant renseigné
});

socket.on('disconnect', () => {
  console.log('❌ Déconnecté du WebSocket');
  // Les notifications continuent d'être persistées pendant la déconnexion
});
```

**⚠️ Important** :

- Le `userId` dans la query est **obligatoire**
- À la connexion, vous recevrez automatiquement toutes vos notifications non lues via `unread-notifications`
- Les nouvelles notifications arrivent via `new-notification`

### Étape 3 : Créer un projet (déclenche la notification)

```bash
POST http://localhost:4000/projects
Headers:
  Content-Type: application/json
  # Ajouter votre token d'auth si nécessaire

Body:
{
  "title": "Test Notification Project",
  "description": "Projet pour tester les notifications",
  "shortDescription": "Test notif",
  "techStacks": ["1", "2"],
  "categories": ["1"],
  "keyFeatures": ["Feature 1"],
  "projectGoals": ["Goal 1"],
  "projectRoles": []
}
```

### Étape 4 : Vérifier la réception

Dans la console du navigateur, vous devriez voir :

```javascript
📩 {
  id: "notification-uuid",
  userId: "user-123",
  type: "project.created",
  payload: {
    projectTitle: "Test Notification Project",
    message: "Votre projet a été créé avec succès !",
    projectId: "project-uuid"
  },
  createdAt: "2024-01-01T10:00:00Z",
  readAt: null
}
```

### Étape 5 : Tester les API REST

```bash
# Récupérer les notifications non lues
GET http://localhost:4000/notifications/unread?userId=user-123

# Marquer une notification comme lue
PATCH http://localhost:4000/notifications/{notification-id}/read

# Marquer toutes comme lues
PATCH http://localhost:4000/notifications/read-all
Body: { "userId": "user-123" }
```

## 🧪 Test des Scénarios Hors Ligne

### Scénario 1 : Utilisateur connecté (temps réel)

1. Connectez-vous au WebSocket
2. Créez un projet → Vous recevez immédiatement la notification via `new-notification`

### Scénario 2 : Utilisateur hors ligne puis reconnecté

1. **Déconnectez-vous** du WebSocket (ou fermez la page)
2. **Créez un projet** (API REST) → La notification est persistée en base
3. **Reconnectez-vous** au WebSocket → Vous recevez la notification via `unread-notifications`

```javascript
// Test de reconnexion après période hors ligne
socket.disconnect(); // Simuler déconnexion

// Créer une notification pendant la déconnexion (via API ou autre utilisateur)
// ...

socket.connect(); // Reconnexion

// Résultat attendu : réception via 'unread-notifications'
socket.on('unread-notifications', (notifications) => {
  console.log('📬 Notifications ratées pendant la déconnexion:', notifications);
});
```

### Scénario 3 : Test de lecture

```javascript
// Marquer une notification comme lue
socket.on('new-notification', async (notification) => {
  console.log('📩 Reçu:', notification);

  // Marquer comme lue via API
  await fetch(`/notifications/${notification.id}/read`, { method: 'PATCH' });

  // Vous devriez recevoir une mise à jour
});

socket.on('notification-update', (notification) => {
  console.log('🔄 Marquée comme lue:', notification.readAt);
});
```

## 🔄 Exemple Complet : Projet Créé

### 1. L'utilisateur crée un projet

```typescript
// CreateProjectCommandHandler
async execute(command: CreateProjectCommand) {
  // ... création du projet ...

  // 🎯 Émission de l'événement
  this.eventEmitter.emit('project.created', {
    projectId: savedProject.value.toPrimitive().id,
    projectTitle: savedProject.value.toPrimitive().title,
    ownerId: command.props.ownerId,
    ownerName: 'John Doe'
  });
}
```

### 2. Le listener capture l'événement

```typescript
// ProjectListener
@OnEvent('project.created')
async handleProjectCreated(payload) {
  const command = new CreateNotificationCommand({
    userId: payload.ownerId,
    type: 'project.created',
    payload: {
      projectTitle: payload.projectTitle,
      message: `🎉 Félicitations ! Votre projet "${payload.projectTitle}" a été créé.`
    }
  });

  await this.commandBus.execute(command);
}
```

### 3. La notification est traitée

```typescript
// CreateNotificationCommandHandler
async execute(command) {
  // 1. Valide avec l'entité du domaine
  const notification = Notification.create({
    userId: command.payload.userId,
    type: command.payload.type,
    payload: command.payload.payload
  });

  // 2. Délègue au service d'infrastructure
  return await this.notificationService.sendNotification(command.payload);
}
```

### 4. Le service persiste et diffuse

```typescript
// NotificationService
async sendNotification(notification) {
  // 1. Persister en DB
  const saved = await this.prisma.notification.create({...});

  // 2. Envoyer via WebSocket
  await this.realtimeAdapter.send(notificationData);
}
```

### 5. L'utilisateur reçoit la notification

```javascript
// Côté client
socket.on('new-notification', (notification) => {
  // Afficher une toast ou mettre à jour l'UI
  showToast(notification.payload.message);
});
```

## 🎨 Types de Notifications Recommandés

```typescript
// Événements projets
'project.created'; // Projet créé
'project.updated'; // Projet modifié
'project.deleted'; // Projet supprimé

// Événements rôles
'project.role.assigned'; // Rôle assigné
'project.role.unassigned'; // Rôle désassigné
'project.role.applied'; // Candidature à un rôle

// Événements collaboration
'project.member.joined'; // Nouveau membre
'project.member.left'; // Membre parti
'project.invite.sent'; // Invitation envoyée

// Événements système
'system.maintenance'; // Maintenance planifiée
'user.welcome'; // Message de bienvenue
```

## ❓ Questions Fréquentes

### Q: Dois-je être connecté au WebSocket pour recevoir des notifications ?

**R**: Non ! Les notifications sont **toujours persistées** en base de données. Si vous êtes hors ligne, elles vous seront envoyées à la prochaine connexion via l'événement `unread-notifications`.

### Q: Que se passe-t-il si je me connecte depuis plusieurs appareils ?

**R**: Actuellement, une seule connexion par utilisateur est maintenue. La dernière connexion remplace la précédente. Les notifications non lues seront envoyées sur la connexion active.

### Q: Comment savoir si une notification a été lue ?

**R**: Le champ `readAt` indique la date de lecture. S'il est `null`, la notification n'a pas été lue. Vous pouvez également écouter l'événement `notification-update`.

### Q: Les notifications sont-elles supprimées après lecture ?

**R**: Non, elles restent en base avec `readAt` renseigné. Seules les notifications **non lues** (`readAt = null`) sont renvoyées lors de la reconnexion.

### Q: Puis-je envoyer des notifications sans WebSocket ?

**R**: Oui ! Utilisez directement `CreateNotificationCommand` via l'API REST. La notification sera persistée et envoyée lors de la prochaine connexion de l'utilisateur.

## ⚠️ Bonnes Pratiques

1. **Événements spécifiques** : Utilisez des noms d'événements clairs et hiérarchiques
2. **Payload minimal** : N'incluez que les données nécessaires
3. **Gestion d'erreurs** : Toujours gérer les cas d'échec dans les listeners
4. **Tests** : Testez chaque listener individuellement
5. **Performance** : Évitez les opérations lourdes dans les listeners
6. **Logs** : Loggez les événements pour le debugging
7. **UserId obligatoire** : Toujours valider que l'userId est fourni pour la connexion WebSocket

## 🚀 Prochaines Évolutions

- Notifications par email (channel: 'email')
- Notifications push mobiles
- Préférences utilisateur (types activés/désactivés)
- Templates de notifications
- Notifications groupées
- Système de retry automatique

---

✨ **Le système de notifications est maintenant prêt à l'emploi !** Suivez ce guide pour ajouter facilement de nouvelles notifications automatisées.

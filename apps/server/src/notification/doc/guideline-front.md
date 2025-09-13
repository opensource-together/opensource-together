# Guide Frontend - Système de Notifications

Ce guide explique comment intégrer le système de notifications dans votre application frontend.

## Vue d'ensemble

Le système de notifications d'OpenSource Together permet :

- **Notifications en temps réel** via WebSocket
- **Persistance** des notifications en base de données
- **Synchronisation** automatique des notifications non lues
- **Gestion des statuts** (lu/non lu)

## Configuration

### 1. Connexion WebSocket

```typescript
import { io } from 'socket.io-client';

// Connexion au namespace notifications
const socket = io('/notifications', {
  auth: { token: wsToken }, // Token JWT obtenu via l'API
  autoConnect: true,
});

// Gestion des événements de connexion
socket.on('connect', () => {
  console.log('✅ Connecté au système de notifications');
});

socket.on('disconnect', () => {
  console.log('❌ Déconnecté du système de notifications');
});
```

### 2. Obtenir le token WebSocket

```typescript
// Récupérer le token WebSocket via l'API
const getWsToken = async (): Promise<string> => {
  const response = await fetch('/api/notifications/ws-token', {
    credentials: 'include', // Important pour les cookies de session
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer le token WebSocket');
  }

  const data = await response.json();
  return data.wsToken;
};
```

## Événements WebSocket

### Événements reçus du serveur

#### `unread-notifications`

**Quand :** À la connexion et sur demande de rafraîchissement
**Utilité :** Récupère toutes les notifications non lues

```typescript
socket.on('unread-notifications', (notifications: NotificationData[]) => {
  console.log('📬 Notifications non lues:', notifications);

  // Mettre à jour votre état local
  setUnreadNotifications(notifications);

  // Mettre à jour le compteur de notifications
  updateNotificationBadge(notifications.length);
});
```

#### `new-notification`

**Quand :** Nouvelle notification créée
**Utilité :** Notification en temps réel

```typescript
socket.on('new-notification', (notification: NotificationData) => {
  console.log('🔔 Nouvelle notification:', notification);

  // Ajouter à la liste des notifications
  addNotification(notification);

  // Afficher une notification toast
  showNotificationToast({
    title: notification.object,
    message: notification.payload.message || 'Nouvelle notification',
    type: notification.type,
  });

  // Mettre à jour le compteur
  incrementNotificationBadge();
});
```

#### `notification-read`

**Quand :** Une notification est marquée comme lue
**Utilité :** Synchronisation du statut de lecture

```typescript
socket.on('notification-read', (notification: NotificationData) => {
  console.log('✅ Notification marquée comme lue:', notification);

  // Mettre à jour le statut local
  markNotificationAsRead(notification.id);

  // Mettre à jour le compteur
  updateNotificationBadge();
});
```

### Événements envoyés au serveur

#### `refresh-unread`

**Utilité :** Demander un rafraîchissement des notifications

```typescript
// Rafraîchir les notifications manuellement
const refreshNotifications = () => {
  socket.emit('refresh-unread');
};

// Exemple d'utilisation
const handleRefreshClick = () => {
  refreshNotifications();
  // Le serveur répondra avec l'événement 'unread-notifications'
};
```

## API REST Endpoints

### 1. Récupérer les notifications non lues

```typescript
const getUnreadNotifications = async (): Promise<NotificationData[]> => {
  const response = await fetch('/api/notifications/unread', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Impossible de récupérer les notifications');
  }

  return response.json();
};
```

### 2. Marquer une notification comme lue

```typescript
const markAsRead = async (notificationId: string): Promise<void> => {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Impossible de marquer la notification comme lue');
  }
};
```

### 3. Marquer toutes les notifications comme lues

```typescript
const markAllAsRead = async (): Promise<void> => {
  const response = await fetch('/api/notifications/read-all', {
    method: 'PATCH',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(
      'Impossible de marquer toutes les notifications comme lues',
    );
  }
};
```

### 4. Créer une notification

```typescript
const createNotification = async (data: {
  object: string;
  receiverId: string;
  type: string;
  payload: Record<string, unknown>;
  channels?: ('realtime' | 'email')[];
}): Promise<void> => {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Impossible de créer la notification');
  }
};
```

**Cas d'usage :**

- **Notifications manuelles** : Envoyer une notification à un utilisateur spécifique
- **Notifications système** : Créer des notifications programmatiquement
- **Tests et développement** : Tester le système de notifications
- **Intégrations externes** : Permettre à des services tiers d'envoyer des notifications

## Types TypeScript

```typescript
export interface NotificationData {
  id?: string;
  object: string;
  receiverId: string;
  senderId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt?: Date;
  readAt?: Date | null;
}

export interface CreateNotificationRequest {
  object: string;
  receiverId: string;
  type: string;
  payload: Record<string, unknown>;
  channels?: ('realtime' | 'email')[];
}
```

## Exemple d'intégration complète

```typescript
import { io, Socket } from 'socket.io-client';

class NotificationManager {
  private socket: Socket | null = null;
  private wsToken: string | null = null;

  async initialize() {
    try {
      // 1. Récupérer le token WebSocket
      this.wsToken = await this.getWsToken();

      // 2. Se connecter au WebSocket
      this.socket = io('/notifications', {
        auth: { token: this.wsToken },
      });

      // 3. Configurer les événements
      this.setupEventListeners();
    } catch (error) {
      console.error("Erreur d'initialisation des notifications:", error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connecté aux notifications');
    });

    this.socket.on('unread-notifications', (notifications) => {
      this.handleUnreadNotifications(notifications);
    });

    this.socket.on('new-notification', (notification) => {
      this.handleNewNotification(notification);
    });

    this.socket.on('notification-read', (notification) => {
      this.handleNotificationRead(notification);
    });
  }

  private handleUnreadNotifications(notifications: NotificationData[]) {
    // Mettre à jour votre état global
    this.updateUnreadCount(notifications.length);
    this.displayNotifications(notifications);
  }

  private handleNewNotification(notification: NotificationData) {
    // Afficher une notification toast
    this.showToast(notification);

    // Mettre à jour le compteur
    this.incrementUnreadCount();
  }

  private handleNotificationRead(notification: NotificationData) {
    // Mettre à jour l'interface
    this.updateNotificationStatus(notification.id, true);
  }

  // Méthodes utilitaires
  refreshNotifications() {
    this.socket?.emit('refresh-unread');
  }

  async markAsRead(notificationId: string) {
    await this.markNotificationAsRead(notificationId);
  }

  async markAllAsRead() {
    await this.markAllNotificationsAsRead();
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

// Utilisation
const notificationManager = new NotificationManager();
await notificationManager.initialize();
```

## Bonnes pratiques

### 1. Gestion des erreurs

```typescript
socket.on('connect_error', (error) => {
  console.error('Erreur de connexion WebSocket:', error);
  // Implémenter une logique de reconnexion
});
```

### 2. Reconnexion automatique

```typescript
socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Le serveur a fermé la connexion, se reconnecter manuellement
    socket.connect();
  }
});
```

### 3. Nettoyage des ressources

```typescript
// Nettoyer les listeners lors de la déconnexion
const cleanup = () => {
  socket.removeAllListeners();
  socket.disconnect();
};
```

### 4. Gestion de l'état

```typescript
// Utiliser un état global pour les notifications
const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Logique de gestion des notifications...

  return { notifications, unreadCount, markAsRead, refreshNotifications };
};
```

## Types de notifications supportés

- `project_created` - Nouveau projet créé
- `project_updated` - Projet mis à jour
- `project_deleted` - Projet supprimé
- `role_applied` - Candidature à un rôle
- `role_accepted` - Candidature acceptée
- `role_rejected` - Candidature rejetée
- `message_received` - Nouveau message reçu

## Dépannage

### Problèmes courants

1. **Token WebSocket invalide**
   - Vérifiez que l'utilisateur est bien connecté
   - Régénérez le token si nécessaire

2. **Connexion WebSocket échoue**
   - Vérifiez la configuration CORS
   - Vérifiez que le serveur est accessible

3. **Notifications non reçues**
   - Vérifiez que l'utilisateur est connecté au WebSocket
   - Vérifiez les logs du serveur

4. **Notifications dupliquées**
   - Évitez les connexions multiples
   - Nettoyez les listeners avant de vous reconnecter

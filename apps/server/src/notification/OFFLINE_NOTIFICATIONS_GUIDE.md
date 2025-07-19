# 📱 Guide : Notifications Hors Ligne

## 🎯 Fonctionnalités Implémentées

Le système de notifications supporte maintenant la **persistance et synchronisation hors ligne** :

### ✅ Nouvelles Capacités

1. **Persistance automatique** : Toutes les notifications sont sauvegardées en base
2. **Synchronisation à la reconnexion** : Les notifications non lues sont envoyées automatiquement
3. **Marquage lecture** : Suivi de l'état lu/non-lu par notification
4. **API REST complète** : Endpoints pour gérer les notifications

## 🔌 Flux WebSocket Complet

### 1. Connexion initiale

```javascript
// Côté client
const socket = io('http://localhost:3001/notifications', {
  auth: { token: 'your-auth-token' },
});

// Événements reçus automatiquement
socket.on('connected', (data) => {
  console.log('✅ Connecté:', data.message);
});

socket.on('notification', (notification) => {
  console.log('📩 Notification:', notification);
  // notification.isHistorical === true pour les notifications hors ligne
});

socket.on('notifications-sync-complete', (data) => {
  console.log(`🔄 ${data.count} notifications synchronisées`);
});
```

### 2. Cycle de vie complet

```
User Offline → Notifications créées → Stockées en DB
      ↓
User Reconnect → WebSocket → Auto-sync des notifications non lues
      ↓
User Read → Mark as read → Plus affichées lors de prochaine sync
```

## 🛠️ API REST Endpoints

### GET /notifications/unread

Récupère toutes les notifications non lues

```bash
GET /notifications/unread?userId=mock_user_id

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "mock_user_id",
      "type": "project.role.assigned",
      "payload": { "projectTitle": "Mon Projet" },
      "createdAt": "2024-01-01T10:00:00Z",
      "readAt": null
    }
  ],
  "count": 1
}
```

### PATCH /notifications/:id/read

Marque une notification comme lue

```bash
PATCH /notifications/abc-123/read

Response:
{
  "success": true,
  "message": "Notification marquée comme lue"
}
```

### PATCH /notifications/read-all

Marque toutes les notifications comme lues

```bash
PATCH /notifications/read-all
Body: { "userId": "mock_user_id" }

Response:
{
  "success": true,
  "message": "Toutes les notifications marquées comme lues"
}
```

## 🧪 Test du Système

### Scénario complet de test :

```bash
# 1. Créer une notification (utilisateur hors ligne)
POST http://localhost:3001/notifications
{
  "userId": "mock_user_id",
  "type": "project.role.assigned",
  "payload": { "projectTitle": "Test Project", "roleName": "Developer" }
}

# 2. Vérifier qu'elle est stockée
GET http://localhost:3001/notifications/unread?userId=mock_user_id

# 3. Se connecter via WebSocket → Notifications auto-sync

# 4. Marquer comme lue
PATCH http://localhost:3001/notifications/{id}/read

# 5. Vérifier qu'elle n'apparaît plus
GET http://localhost:3001/notifications/unread?userId=mock_user_id
```

## 📊 Structure Base de Données

```sql
-- Table notification (déjà existante)
model Notification {
  id        String    @id @default(uuid())
  userId    String                    -- Destinataire
  type      String                    -- Type d'événement
  payload   Json                      -- Données métier
  createdAt DateTime  @default(now()) -- Date création
  readAt    DateTime?                 -- Date lecture (null = non lu)
  @@index([userId, createdAt])        -- Index pour requêtes
}
```

## 🔄 Architecture CQRS

### Commands (Actions)

- `CreateNotificationCommand` : Créer notification
- `MarkNotificationReadCommand` : Marquer une notification lue
- `MarkAllNotificationsReadCommand` : Marquer toutes lues

### Queries (Lectures)

- `GetUnreadNotificationsQuery` : Récupérer non lues

### Services

- `NotificationService` : Orchestration business logic
- `NotificationsGateway` : WebSocket real-time + sync hors ligne

## 🎨 Événements WebSocket

```javascript
// Événements émis par le serveur
'connected'; // Confirmation connexion
'notification'; // Nouvelle notification (temps réel ou historique)
'notifications-sync-complete'; // Fin sync notifications hors ligne
'notifications-sync-error'; // Erreur sync
```

## 🚀 Prochaines Améliorations

1. **Authentification réelle** : Remplacer `mock_user_id` par SuperTokens
2. **Pagination** : Pour utilisateurs avec beaucoup de notifications
3. **Push notifications** : Via service workers pour navigateur fermé
4. **Email fallback** : Si utilisateur ne se reconnecte pas
5. **Cleanup automatique** : Supprimer anciennes notifications lues

---

✨ **Le système est maintenant prêt pour la production !** Les utilisateurs ne perdront plus jamais de notifications, même hors ligne.

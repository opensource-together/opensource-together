# 🔧 Refactorisation WebSocket Authentication - Rapport Technique

## 📖 Vue d'ensemble

Cette documentation détaille la refactorisation majeure du système d'authentification WebSocket et les problèmes identifiés lors de l'implémentation.

## 🏗️ Architecture Précédente vs Nouvelle

### Avant (Architecture problématique)
```
NotificationsGateway
├── Authentification mélangée dans handleConnection
├── Guards WebSocket mal configurés (@UseGuards inefficaces)
├── Logique de connexion dispersée
└── Responsabilités non séparées
```

### Après (Architecture refactorisée)
```
WebSocketAuthModule
├── WebSocketAuthService (authentification centralisée)
├── WsJwtService (génération/validation JWT)
└── WebSocketConnectionManager (gestion connexions)

NotificationsGateway
├── Responsabilité unique: événements WebSocket
├── Délégation authentification → WebSocketAuthService
└── Délégation connexions → WebSocketConnectionManager
```

## 🔄 Changements Techniques Apportés

### 1. Création du Module d'Authentification WebSocket

**Nouveau fichier**: `apps/server/src/auth/web-socket/websocket-auth.module.ts`
```typescript
@Module({
  imports: [JwtModule.register({...})],
  providers: [WsJwtService, WebSocketAuthService],
  exports: [WsJwtService, WebSocketAuthService],
})
export class WebSocketAuthModule {}
```

**Responsabilités**:
- Configuration JWT dédiée WebSocket
- Export des services d'authentification
- Module autonome et réutilisable

### 2. Service d'Authentification WebSocket

**Nouveau fichier**: `apps/server/src/auth/web-socket/websocket-auth.service.ts`

**Fonctionnalités**:
- Extraction token depuis handshake (`x-ws-token`)
- Validation JWT via `WsJwtService`
- Injection `userId` dans le socket client
- Gestion centralisée des erreurs d'authentification

**Méthode principale**:
```typescript
async authenticateSocket(client: Socket): Promise<string | null>
```

### 3. Gestionnaire de Connexions

**Nouveau fichier**: `apps/server/src/contexts/notification/infrastructure/gateways/websocket-connection.manager.ts`

**Responsabilités**:
- Maintien de la Map `userId` → `socket`
- Gestion connexions/déconnexions
- Fermeture automatique des anciennes connexions
- Méthodes utilitaires (`isUserConnected`, `getSocketForUser`, etc.)

### 4. Refactorisation du NotificationsGateway

**Changements majeurs**:
- Suppression de la logique d'authentification interne
- Délégation à `WebSocketAuthService` et `WebSocketConnectionManager`
- Nettoyage des handlers d'événements
- Séparation claire des responsabilités

**Flux d'authentification simplifié**:
```typescript
async handleConnection(client: AuthenticatedSocket) {
  const userId = await this.webSocketAuthService.authenticateSocket(client);
  if (!userId) {
    client.disconnect();
    return;
  }
  this.connectionManager.registerConnection(userId, client);
  await this.sendUnreadNotifications(userId);
}
```

### 5. Correction de la Boucle de Dépendance

**Problème identifié**: 
```
NotificationService → RealtimeNotifierAdapter → NotificationsGateway → NotificationService
```

### 6. Nettoyage des Guards Inutiles

**A revoir**: `ws-jwt.guard.ts` - Les guards NestJS ne fonctionnent pas sur `handleConnection`/`handleDisconnect`.

**Remplacement**: Authentification manuelle dans `handleConnection` via `WebSocketAuthService`.

## 🐛 Bugs Identifiés et Statut

### 🔴 Bug #1: Connexion WebSocket se ferme instantanément
**Symptômes**:
- `Disconnected from ws://localhost:4000/notifications`
- `IO server disconnect: The server has forcefully disconnected the socket`

**Causes possibles**:
1. **Token manquant ou mal transmis** par le client
2. **Token expiré ou invalide**
3. **Secret JWT incorrect** dans l'environnement
4. **Format du handshake incorrect** (`x-ws-token` vs `authorization`)

**Status**: 🔍 **EN INVESTIGATION**

**Logs à analyser**:
```typescript
// Dans WebSocketAuthService.authenticateSocket()
this.logger.log(`Token extraits: ${token ? 'PRÉSENT' : 'MANQUANT'}`);
this.logger.log(`UserId vérifié: ${userId || 'ÉCHEC'}`);
```
Pour l'instant j'ai commenté la ligne responsable de cela dans `web-connection-manager.ts`:
```ts
  registerConnection(userId: string, socket: AuthenticatedSocket): void {
    // Fermer l'ancienne connexion si elle existe
    const existingSocket = this.userSockets.get(userId);
    // if (existingSocket) {
    //   this.logger.log(
    //     `Fermeture de l'ancienne connexion pour l'utilisateur ${userId}`,
    //   );
    //   existingSocket.disconnect();
    // }

    this.userSockets.set(userId, socket);
    this.logger.log(`Utilisateur ${userId} connecté (Socket: ${socket.id})`);
  }
```

### 🟡 Bug #2: Notifications non lues non reçues en temps réel
**Symptômes**:
- Nécessité de déconnecter/reconnecter pour avoir les nouvelles notifications
- Les notifications arrivent seulement lors de `handleConnection`

**Cause identifiée**: Les notifications non lues ne sont envoyées qu'à la connexion, pas lors de nouvelles notifications.

**Status**: 🛠️ **RÉSOLU PARTIELLEMENT**

**Solution implémentée**:
```typescript
async sendNotificationToUser(notification: NotificationData): Promise<void> {
  // 1. Envoie la nouvelle notification
  socket.emit('new-notification', notification);
  
  // 2. Met à jour la liste des non lues
  await this.sendUnreadNotifications(notification.userId);
}
```


## 🔧 Configuration Requise

### Variables d'environnement
```bash
# Dans .env
JWT_SECRET=your-secret-key-here
```

### Côté Client (POSTMAN)

1 - Récupérer un token sur l'endpoint dédié:
`GET /v1/notifications/ws-token`
![get-ws-token](./Screenshot%202025-07-22%20at%2012.44.56.png)
2 - Utiliser le token dans le header:
`ws://localhost:4000/notifications`
![connect-socket](./Screenshot%202025-07-22%20at%2012.32.09.png)
Copie colle le token recus dans le endpoint précédent, sur le screen c'est une variable que j'ai configurer mais tu as juste a coller le token.

### Vérification des Logs
```bash
# Logs attendus dans la console serveur:
[WebSocketAuthService] Token extrait: PRÉSENT
[WebSocketAuthService] UserId vérifié: user-123
[WebSocketConnectionManager] Utilisateur user-123 connecté
[NotificationsGateway] Envoi de X notifications non lues à user-123
```
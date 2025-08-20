# 💬 Système de Messagerie OST - Guide Pratique

## 🎯 Concept Simple

**Messagerie = REST API + WebSocket**

- **REST API** : Pour les actions (créer chat, envoyer message, récupérer historique)
- **WebSocket** : Pour recevoir les notifications temps réel

## 🔧 Quand Utiliser Quoi ?

### 📡 REST API - Actions & Données

```bash
✅ Créer un chat          → POST /messaging/chats
✅ Envoyer un message     → POST /messaging/chats/:id/messages
✅ Récupérer historique   → GET /messaging/chats/:id/messages
✅ Liste des chats        → GET /messaging/chats
```

### 🔌 WebSocket - Notifications Temps Réel

```bash
✅ Recevoir nouveaux messages    → Event: new-message
✅ Voir les chats mis à jour     → Event: chat-updated
✅ Savoir qu'un chat est créé    → Event: chat-created
✅ Rejoindre un chat             → Event: join-chat
✅ Ecouter tout les chats        → Event: listen-all-chats
✅ Quitter un chat               → Event: leave-chat
✅ Quitter tous les chats        → Event: leave-all-chats
```

## 🚀 Test Complet avec Postman

### Étape 1: Créer un Chat (REST)

```bash
POST http://localhost:4000/v1/messaging/chats
Content-Type: application/json
Cookie: sAccessToken=your_session

{
  "participants": ["alice", "bob"],
  "name": "Chat Test"
}
```

### Étape 2: Se Connecter au WebSocket

**Postman WebSocket :**

```
ws://localhost:4000/messaging?userId=alice
```

### Étape 3: Écouter les Messages d'un Chat

**Dans Postman WebSocket, envoyer :**

```json
{
  "event": "join-chat",
  "data": {
    "chatId": "chat_id_retourné_étape_1"
  }
}
```

### Étape 4: Écouter Tous les Chats (Interface Globale)

**Dans Postman WebSocket, envoyer :**

```json
{
  "event": "listen-all-chats",
  "data": {}
}
```

### Étape 5: Envoyer un Message (REST)

```bash
POST http://localhost:4000/v1/messaging/chats/chat_id_123/messages
Content-Type: application/json
Cookie: sAccessToken=your_session

{
  "content": "Hello depuis Postman !"
}
```

**→ Résultat : Le message apparaît instantanément dans le WebSocket**

### Étape 6: Quitter un Chat (Optionnel)

**Pour arrêter de recevoir les messages d'un chat spécifique :**

```json
{
  "event": "leave-chat",
  "data": {
    "chatId": "chat_id_123"
  }
}
```

**Pour quitter tous les chats d'un coup :**

```json
{
  "event": "leave-all-chats",
  "data": {}
}
```

## 📱 Flow Complet - 2 Utilisateurs

```ascii
[Alice - Postman]         [Bob - Postman]
       |                        |
   REST: Créer chat              |
       |                        |
   WS: join-chat            WS: join-chat
       |                        |
   REST: Envoyer msg             |
       |                        |
       |                WS: new-message ✅
       |                        |
       |              REST: Envoyer msg
       |                        |
   WS: new-message ✅           |
```

## 🎯 Événements WebSocket que tu Reçois

### `new-message` - Nouveau message dans un chat

```json
{
  "event": "new-message",
  "data": {
    "chatId": "chat_123",
    "message": {
      "id": "msg_456",
      "content": "Hello!",
      "senderId": "bob"
    }
  }
}
```

### `chat-updated` - Chat mis à jour (pour l'interface globale)

```json
{
  "event": "chat-updated",
  "data": {
    "chatId": "chat_123",
    "lastMessage": {
      "content": "Hello!",
      "senderId": "bob"
    }
  }
}
```

### `chat-created` - Nouveau chat créé

```json
{
  "event": "chat-created",
  "data": {
    "chat": {
      "id": "chat_456",
      "name": "Nouveau Chat",
      "participants": ["alice", "bob"]
    }
  }
}
```

## 🔄 Pourquoi Cette Architecture ?

| Besoin                     | Solution                     | Pourquoi                          |
| -------------------------- | ---------------------------- | --------------------------------- |
| **Créer un chat**          | REST API                     | Action ponctuelle avec réponse    |
| **Envoyer un message**     | REST API                     | Action ponctuelle avec validation |
| **Voir nouveaux messages** | WebSocket                    | Temps réel sans polling           |
| **Interface de chat**      | WebSocket `join-chat`        | Messages instantanés              |
| **Liste des discussions**  | WebSocket `listen-all-chats` | Notifications globales            |
| **Charger historique**     | REST API                     | Pagination et performance         |
| **Quitter un chat**        | WebSocket `leave-chat`       | Optimisation des ressources       |
| **Quitter tous les chats** | WebSocket `leave-all-chats`  | Nettoyage global                  |

## ⚡ Test Rapide - 30 Secondes

1. **Créer chat** via REST → Copier l'ID retourné
2. **Ouvrir WebSocket** Postman avec `?userId=alice`
3. **Envoyer `join-chat`** avec l'ID du chat
4. **Envoyer message** via REST → Voir apparaître dans WebSocket ✅
5. **Envoyer `leave-chat`** → Plus de messages reçus ❌
6. **Envoyer `join-chat`** à nouveau → Messages reçus de nouveau ✅

## 🚨 Points Importants

- ✅ **WebSocket** = Réception seulement (écouter)
- ✅ **REST API** = Actions (créer, envoyer, récupérer)
- ✅ **Cookie Session** requis pour REST API
- ✅ **Query param userId** requis pour WebSocket
- ✅ **Port 4000** par défaut
- ✅ **Namespace `/messaging`** pour WebSocket

## 🔧 **Debug et Résolution des Problèmes**

### **Problème : Événements qui fonctionnent une fois sur deux**

Si vous rencontrez des problèmes avec `join-chat`, `leave-chat`, etc., utilisez ces commandes de debug :

#### **1. Vérifier le statut de connexion**

```json
// Dans Postman WebSocket, envoyer :
{
  "event": "debug-status",
  "data": {}
}
```

**Réponse attendue :**

```json
{
  "event": "debug-status",
  "data": {
    "userId": "alice",
    "connected": true,
    "socketId": "socket_123",
    "chats": ["chat_abc", "chat_def"],
    "totalUsers": 2,
    "totalChats": 2
  }
}
```

#### **2. Vérifier les événements de confirmation**

Maintenant, chaque action renvoie une confirmation :

**Join Chat :**

```json
// Envoi
{"event": "join-chat", "data": {"chatId": "chat_123"}}

// Réponse de succès
{"event": "chat-joined", "data": {"chatId": "chat_123", "status": "success"}}

// Réponse d'erreur
{"event": "error", "data": {"message": "User ID not found"}}
```

**Leave Chat :**

```json
// Envoi
{"event": "leave-chat", "data": {"chatId": "chat_123"}}

// Réponse de succès
{"event": "chat-left", "data": {"chatId": "chat_123", "status": "success"}}
```

**Listen All Chats :**

```json
// Envoi
{"event": "listen-all-chats", "data": {}}

// Réponse de succès
{"event": "listening-all-chats", "data": {"status": "success"}}
```

#### **3. Nettoyer et reconnecter si nécessaire**

```bash
# 1. Fermer la connexion WebSocket
# 2. Attendre 2-3 secondes
# 3. Reconnecter avec le même userId
# 4. Vérifier le statut avec debug-status
```

### **4. Logs côté serveur**

Vérifiez les logs du serveur pour voir :

- ✅ `User alice joined chat chat_123`
- ✅ `User alice left chat chat_123`
- ✅ `User alice is now listening to all their chats`

### **5. Problèmes courants et solutions**

| Problème               | Symptôme                    | Solution                |
| ---------------------- | --------------------------- | ----------------------- |
| **Événements ignorés** | Pas de réponse              | Vérifier `debug-status` |
| **Chat déjà rejoint**  | Message "already in chat"   | Normal, pas d'erreur    |
| **Chat non rejoint**   | Message "not in chat"       | Normal, pas d'erreur    |
| **Déconnexion**        | Événements ne marchent plus | Reconnecter WebSocket   |

## 🔄 Gestion des Abonnements Chat

### 🎯 Quand Utiliser leave-chat ?

```bash
# Exemple : User change de page, plus besoin des notifications de ce chat
{"event": "leave-chat", "data": {"chatId": "chat_123"}}

# → Plus de messages new-message de ce chat
# → Économise de la bande passante
# → Évite les notifications inutiles
```

### 🧹 Quand Utiliser leave-all-chats ?

```bash
# Exemple : User ferme l'app ou se déconnecte
{"event": "leave-all-chats", "data": {}}

# → Plus aucun message de tous les chats
# → Nettoyage complet des abonnements
# → Optimisation des ressources serveur
```

## 🎯 Use Cases Principaux

### 💬 Chat 1-to-1

```bash
# 1. Alice crée un chat avec Bob
POST /messaging/chats {"participants": ["bob"]}

# 2. Alice et Bob se connectent au WebSocket
ws://localhost:4000/messaging?userId=alice
ws://localhost:4000/messaging?userId=bob

# 3. Ils rejoignent le même chat
{"event": "join-chat", "data": {"chatId": "chat_123"}}

# 4. Conversation temps réel via REST + WebSocket
```

### 📱 Interface de Chat

```bash
# 1. Se connecter au WebSocket
ws://localhost:4000/messaging?userId=alice

# 2. Écouter tous les chats pour l'interface principale
{"event": "listen-all-chats"}

# 3. Charger l'historique d'un chat spécifique
GET /messaging/chats/chat_123/messages

# 4. Rejoindre le chat pour les messages temps réel
{"event": "join-chat", "data": {"chatId": "chat_123"}}

# 5. Quitter le chat quand on change de page
{"event": "leave-chat", "data": {"chatId": "chat_123"}}

# 6. Rejoindre un autre chat
{"event": "join-chat", "data": {"chatId": "chat_456"}}

# 7. Quitter tous les chats avant déconnexion (optionnel)
{"event": "leave-all-chats"}
```

## 🎯 Flow Optimisé pour UX

```ascii
[User Interface]           [WebSocket Events]
       |                         |
   Page Liste ────────────→ listen-all-chats
       |                         |
   Clic Chat 1 ───────────→ join-chat(chat_1)
       |                         |
   Change Chat ───────────→ leave-chat(chat_1)
       |                   join-chat(chat_2)
       |                         |
   Ferme App ─────────────→ leave-all-chats
```

C'est tout ! Le système est maintenant simple et fonctionnel. 🎉

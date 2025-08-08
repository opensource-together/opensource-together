# 🔍 Checklist Production : Système de Notification

## 📋 Vue d'ensemble

Cette checklist vous permet de vérifier que votre système de notification est prêt pour de vrais utilisateurs en production.

## 🎯 1. Tests des API REST

### ✅ Endpoints à tester

#### 1.1 Créer une notification

```bash
POST /notifications
Headers:
  Content-Type: application/json
  # Session avec userId valide requis

Body:
{
  "receiverId": "user-uuid-valide",
  "type": "test.notification",
  "payload": {
    "message": "Test de notification",
    "testData": "valeur"
  },
  "channels": ["realtime"]
}

# ✅ Résultat attendu: Status 201, notification créée
# ❌ À tester: receiverId invalide, senderId manquant, payload vide
```

#### 1.2 Récupérer notifications non lues

```bash
GET /notifications/unread
Headers:
  # Session avec userId valide requis

# ✅ Résultat attendu: Liste des notifications non lues
# ❌ À tester: Utilisateur non connecté
```

#### 1.3 Marquer comme lue

```bash
PATCH /notifications/{notificationId}/read
Headers:
  # Session avec userId valide requis

# ✅ Résultat attendu: Notification marquée comme lue
# ❌ À tester: ID invalide, notification d'un autre utilisateur
```

#### 1.4 Marquer toutes comme lues

```bash
PATCH /notifications/read-all
Headers:
  # Session avec userId valide requis

# ✅ Résultat attendu: Toutes les notifications marquées comme lues
```

#### 1.5 Token WebSocket

```bash
GET /notifications/ws-token
Headers:
  # Session avec userId valide requis

# ✅ Résultat attendu: Token JWT pour WebSocket
# ❌ À tester: Utilisateur non connecté
```

### 🧪 Tests d'erreurs à effectuer

- [x] **Utilisateur non connecté** → 401 Unauthorized
- [x] **receiverId inexistant** → 400 Bad Request avec message clair
- [x] **Payload malformé** → 400 Bad Request
- [x] **ID notification invalide** → 404 Not Found
- [x] **Accès à notification d'un autre utilisateur** → 403 Forbidden

## 🔌 2. Tests WebSocket

### ✅ Flux de connexion complet

#### 2.1 Connexion authentifiée

```javascript
// 1. Récupérer le token
const tokenResponse = await fetch('/notifications/ws-token');
const { wsToken } = await tokenResponse.json();

// 2. Se connecter avec le token
const socket = io('http://localhost:4000/notifications', {
  auth: { token: wsToken },
});

// ✅ À vérifier: Connexion réussie
socket.on('connect', () => {
  console.log('✅ Connexion WebSocket réussie');
});
```

#### 2.2 Réception des notifications non lues

```javascript
socket.on('unread-notifications', (notifications) => {
  console.log(`📬 ${notifications.length} notifications non lues reçues`);
  // ✅ À vérifier: Format correct, données complètes
});
```

#### 2.3 Réception temps réel

```javascript
socket.on('new-notification', (notification) => {
  console.log('📩 Nouvelle notification:', notification);
  // ✅ À vérifier: Structure correcte, données complètes
});
```

#### 2.4 Mises à jour de statut

```javascript
socket.on('notification-read', (notification) => {
  console.log('🔄 Notification marquée comme lue:', notification);
  // ✅ À vérifier: readAt renseigné
});
```

### 🧪 Tests d'erreurs WebSocket

- [x] **Connexion sans token** → Refus de connexion
- [x] **Token invalide/expiré** → Refus de connexion
- [ ] **Multiples connexions** → Dernière connexion remplace la précédente
- [x] **Déconnexion brutale** → Nettoyage correct des connexions

## 🔄 3. Tests Scénarios Hors Ligne

### ✅ Scénario complet à tester

```javascript
// 1. Connecté → Créer notification → Reçue immédiatement
socket.connect();
// Créer une notification via API
// ✅ Vérifier: Réception via 'new-notification'

// 2. Déconnecté → Créer notification → Persistée
socket.disconnect();
// Créer une notification via API
// ✅ Vérifier: Notification en base mais pas envoyée

// 3. Reconnecté → Recevoir notifications manquées
socket.connect();
// ✅ Vérifier: Réception via 'unread-notifications'
```

### 🧪 Tests de robustesse

- [x] **Connexion perdue pendant envoi** → Notification persistée
- [ ] **Reconnexion après longue période** → Toutes les notifications reçues
- [x] **Redémarrage serveur** → Pas de perte de données

## 🗄️ 4. Tests Base de Données

### ✅ Vérifications d'intégrité

#### 4.1 Contraintes de clés étrangères

```sql
-- Tester avec des IDs inexistants
INSERT INTO "Notification" (id, "senderId", "receiverId", type, payload)
VALUES (gen_random_uuid(), 'inexistant', 'inexistant', 'test', '{}');

-- ✅ Résultat attendu: Erreur de contrainte FK
```

#### 4.2 Index et performances

```sql
-- Vérifier les index
EXPLAIN ANALYZE SELECT * FROM "Notification"
WHERE "receiverId" = 'user-id' AND "readAt" IS NULL
ORDER BY "createdAt" DESC;

-- ✅ Vérifier: Utilisation de l'index idx_receiver_unread_notifications
```

#### 4.3 Relations Prisma

```typescript
// Test des relations
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    notificationsReceived: true,
    notificationsSent: true,
  },
});

// ✅ Vérifier: Relations fonctionnelles
```

### 🧪 Tests de cohérence

- [x] **Notifications orphelines** → Aucune notification sans utilisateur
- [ ] **Données JSON valides** → Payload toujours parsable
- [x] **Dates cohérentes** → readAt >= createdAt quand renseigné

## ⚡ 5. Tests de Performance

### ✅ Benchmarks à effectuer

#### 5.1 Création de notifications en masse

```typescript
// Test de charge : 1000 notifications simultanées
const promises = Array.from({ length: 1000 }, (_, i) =>
  fetch('/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      receiverId: `user-${i}`,
      type: 'load.test',
      payload: { index: i },
    }),
  }),
);

await Promise.all(promises);
// ✅ Vérifier: Temps de réponse < 100ms par notification
```

#### 5.2 Connexions WebSocket multiples

```typescript
// Test : 100 connexions simultanées
const sockets = Array.from({ length: 100 }, () =>
  io('http://localhost:4000/notifications', {
    auth: { token: validToken },
  }),
);

// ✅ Vérifier: Toutes connectées, mémoire stable
```

### 🧪 Métriques à surveiller

- [ ] **Temps de réponse API** < 100ms (95e percentile)
- [ ] **Temps connexion WebSocket** < 500ms
- [ ] **Mémoire serveur** stable avec 1000+ connexions
- [ ] **CPU usage** < 80% sous charge normale

## 🔒 6. Tests de Sécurité

### ✅ Vérifications de sécurité

#### 6.1 Authentification

```bash
# Test sans session
curl -X POST http://localhost:4000/notifications \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"user-1","type":"test","payload":{}}'

# ✅ Résultat attendu: 401 Unauthorized
```

#### 6.2 Autorisation

```bash
# Test accès notification d'un autre utilisateur
curl -X PATCH http://localhost:4000/notifications/notification-autre-user/read \
  -H "Cookie: session=valid-session-user-1"

# ✅ Résultat attendu: 403 Forbidden ou 404
```

#### 6.3 Validation des données

```bash
# Test injection XSS dans payload
curl -X POST http://localhost:4000/notifications \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"user-1","type":"<script>alert(\"xss\")</script>","payload":{}}'

# ✅ Vérifier: Données échappées/nettoyées
```

### 🧪 Tests de sécurité avancés

- [ ] **Rate limiting** → Limitation des requêtes par utilisateur
- [ ] **Taille payload** → Limitation à une taille raisonnable
- [ ] **Token WebSocket** → Expiration et rotation
- [ ] **CORS** → Configuration correcte pour votre domaine

## 🚨 7. Tests de Gestion d'Erreurs

### ✅ Scenarios d'erreur à tester

#### 7.1 Base de données indisponible

```typescript
// Simuler une panne DB
// ✅ Vérifier: Messages d'erreur appropriés, pas de crash
```

#### 7.2 WebSocket indisponible

```typescript
// Déconnecter le WebSocket pendant l'envoi
// ✅ Vérifier: Notification persistée, erreur loggée
```

#### 7.3 Payload invalide

```bash
# Test avec payload corrompu
curl -X POST http://localhost:4000/notifications \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"user-1","type":"test","payload":"invalid-json"}'

# ✅ Vérifier: 400 Bad Request avec message clair
```

## 📊 8. Monitoring et Logs

### ✅ Métriques à surveiller en production

#### 8.1 Métriques métier

- [ ] **Notifications créées/min** → Tendance d'usage
- [ ] **Taux de lecture** → Engagement utilisateurs
- [ ] **Temps de lecture moyen** → UX
- [ ] **Connexions WebSocket actives** → Utilisateurs en ligne

#### 8.2 Métriques techniques

- [ ] **Latence API** → Performance
- [ ] **Erreurs 4xx/5xx** → Problèmes applicatifs
- [ ] **Connexions DB** → Santé infrastructure
- [ ] **Mémoire/CPU** → Ressources serveur

#### 8.3 Logs à implémenter

```typescript
// Logs essentiels à ajouter
logger.info('Notification created', {
  notificationId,
  userId,
  type,
  timestamp,
});

logger.warn('WebSocket connection failed', {
  userId,
  reason,
  timestamp,
});

logger.error('Database constraint violation', {
  constraint,
  values,
  timestamp,
});
```

## ✅ Checklist de Déploiement

### 🎯 Avant mise en production

- [ ] **Tous les tests passent** → API, WebSocket, DB, Performance
- [ ] **Migration DB appliquée** → Schema et index en place
- [ ] **Variables d'environnement** → Configuration production
- [ ] **Monitoring configuré** → Alertes et dashboards
- [ ] **Documentation à jour** → Guide d'utilisation système
- [ ] **Plan de rollback** → Procédure en cas de problème

### 🚀 Post-déploiement

- [ ] **Tests de fumée** → Vérification rapide fonctionnalités
- [ ] **Métriques baseline** → Établir références performance
- [ ] **Logs monitoring** → Surveiller erreurs 24h
- [ ] **User feedback** → Retours premiers utilisateurs

## 🛠️ Outils de Test Recommandés

### 📦 Scripts de test

```bash
# Test de charge WebSocket
npm install -g artillery
artillery quick --count 100 --num 10 ws://localhost:4000/notifications

# Test API
npm install -g k6
k6 run notification-load-test.js
```

### 🔧 Monitoring

```bash
# Prisma Studio pour vérifier les données
npx prisma studio

# Logs en temps réel
docker logs -f container-name

# Métriques serveur
htop, iostat, netstat
```

---

## 🎯 Score de Production-Ready

**Total : \_\_ / 50 points**

- Tests API REST : \_\_ / 8 points
- Tests WebSocket : \_\_ / 8 points
- Tests Offline : \_\_ / 6 points
- Tests DB : \_\_ / 6 points
- Tests Performance : \_\_ / 6 points
- Tests Sécurité : \_\_ / 8 points
- Tests Erreurs : \_\_ / 4 points
- Monitoring : \_\_ / 4 points

**≥ 45/50** : ✅ Prêt pour production  
**35-44/50** : ⚠️ Améliorations nécessaires  
**< 35/50** : ❌ Tests complémentaires requis

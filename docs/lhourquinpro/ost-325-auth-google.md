# OST-325 : Authentification Google & Provider Unifié

## Résumé des actions réalisées

- Ajout du provider Google pour l'authentification (signup/signin)
- Ajout du champ `provider` dans le modèle User pour tracer la source d'auth (email, google, github)
- Modularisation de la gestion des providers (Google, GitHub)
- Intégration du bouton Google dans le formulaire de login/signup côté frontend
- Gestion complète du flow Google (callback, création user, session)
- Refactorisation des mappers, services et logs pour supporter le champ provider

## Changements structurels majeurs

### 1. Backend
- Ajout du champ `provider` dans le modèle User et propagation dans la création utilisateur
- Nouvelle fonction `handleGoogleSignUp` pour gérer la création d'utilisateur Google (apps/server/src/auth/recipes/google/google-signInUp.ts)
- Modularisation des configs providers : fichiers séparés pour Google et GitHub
- Refactor du recipe third-party pour supporter plusieurs providers de façon claire
- Logging amélioré lors de la création utilisateur (succès/erreur)

### 2. Frontend
- Ajout du composant `GoogleButton` (apps/web/src/features/auth/components/google-button.component.tsx)
- Intégration du bouton Google dans le `LoginForm` (login et signup)
- Ajout des helpers `getGoogleAuthUrl` et `handleGoogleCallback` dans `auth.service.ts`
- Ajout de la mutation `signInWithGoogle` et du flow de callback dans le hook `useAuth`
- UI/UX : feedback utilisateur lors de la redirection, loading, erreurs

## Configuration requise

- Variables d'environnement Google OAuth (client ID, secret) à renseigner côté backend
- Vérifier la redirection OAuth Google (callback URI) dans la console Google
- Migrations à jour pour le champ `provider` dans la table User

## Utilisation

### 1. Endpoints concernés
- **Frontend** :
  - `GET /auth/callback/google` (callback après OAuth)
  - Utilisation du bouton Google sur la page de login/signup
- **Backend** :
  - Flow Supertokens third-party avec provider `google`

### 2. Flow utilisateur
- L'utilisateur clique sur "Se connecter avec Google" ou "S'inscrire avec Google"
- Redirection vers Google OAuth, puis callback `/auth/callback/google`
- Création ou connexion de l'utilisateur avec le provider `google`
- Session ouverte, redirection vers le profil ou la page d'origine

## Points d'attention

### Pour les développeurs backend
- Toujours renseigner le champ `provider` lors de la création d'un user
- Bien gérer les erreurs de création (rollback, logs, suppression user Supertokens si échec)
- Les configs providers doivent être isolées et maintenues à jour

### Pour les développeurs frontend
- Utiliser les helpers du hook `useAuth` pour tous les flows Google (pas d'appel direct à Supertokens)
- Gérer les états de loading et d'erreur pour une UX fluide
- Vérifier la cohérence du provider dans le profil utilisateur

# Documentation CI/CD pour l'onboarding développeurs

## Introduction

Ce document décrit le fonctionnement de notre pipeline CI/CD (Intégration Continue/Déploiement Continu) basée sur GitHub Actions. Cette pipeline automatise le cycle de versionnement et de déploiement de notre application, qui est composée de deux projets :
- **web** : le frontend de l'application
- **server** : le backend de l'application

## Cycle de vie d'une release

### Vue d'ensemble

Notre pipeline CI/CD fonctionne selon le principe suivant :

1. Les développeurs commitent leur code avec des messages de commit conventionnels
2. Release-please crée automatiquement une PR de release
3. Après validation, la PR est fusionnée, ce qui crée une nouvelle release GitHub
4. La création de la release déclenche le déploiement automatique

### Étapes détaillées

#### 1. Convention de commits

Nous utilisons la [Convention de Commits](https://www.conventionalcommits.org/) pour structurer nos messages de commit. Les préfixes principaux sont :

- `feat:` - Nouvelles fonctionnalités
- `fix:` - Correction de bugs
- `docs:` - Modifications de la documentation
- `style:` - Changements de formatage (espaces, indentation, etc.)
- `refactor:` - Refactorisation de code sans changement de fonctionnalité
- `perf:` - Améliorations de performance
- `test:` - Ajout ou modification de tests
- `chore:` - Tâches de maintenance diverses

**Exemple de commit :**
```
feat: ajouter la fonctionnalité de connexion par oauth
```

#### 2. Création automatique de la Pull Request de release

À chaque commit ou pull request fusionnée dans la branche `main`, l'outil **release-please** analyse les messages de commit et :

- Met à jour le fichier `CHANGELOG.md` avec les changements apportés depuis la dernière version
- Incrémente le numéro de version selon les règles du [versionnement sémantique](https://semver.org/) :
  - `fix:` → incrémente la version de patch (1.0.0 → 1.0.1)
  - `feat:` → incrémente la version mineure (1.0.0 → 1.1.0)
  - `feat:` avec mention `BREAKING CHANGE` → incrémente la version majeure (1.0.0 → 2.0.0)
- Crée ou met à jour une Pull Request dédiée à la release

Cette PR contient toutes les modifications nécessaires pour préparer la nouvelle version.

#### 3. Validation et fusion de la Pull Request de release

**Action manuelle à effectuer :**

Lorsque vous êtes satisfait des changements qui vont constituer la prochaine release :

1. Accédez à l'onglet "Pull requests" dans le repository GitHub
2. Trouvez la PR créée par release-please (généralement intitulée "chore(main): release X.Y.Z")
3. Examinez les modifications apportées au CHANGELOG.md
4. Fusionnez la PR en cliquant sur le bouton "Merge pull request"

> **Important** : La fusion de cette PR est l'étape déclenchant la création de la release !

La fusion de cette PR va :
- Mettre à jour la branche `main` avec les changements de version
- Créer un tag Git correspondant à la nouvelle version
- Créer une Release GitHub officielle listant les changements comme détaillés dans le CHANGELOG

#### 4. Déploiement automatique suite à la création de la release

Une fois la release créée, deux workflows GitHub Actions sont automatiquement déclenchés pour les projets `web` et `server` :

1. **Phase de test** :
   - Exécution des tests unitaires (`pnpm test`)
   - Exécution des tests end-to-end (`pnpm test:e2e`)

2. **Phase de déploiement** :
   - Construction des images Docker
   - Publication des images vers GitHub Container Registry (ghcr.io)
   - Mise à jour des labels sur les packages précédents

Ce processus est entièrement automatisé et ne nécessite aucune intervention manuelle une fois la release créée.

## Ressources complémentaires

- [Convention de Commits](https://www.conventionalcommits.org/)
- [Versionnement Sémantique](https://semver.org/)

# Documentation de la fonctionnalité : Importer un projet depuis GitHub

Ce document fournit une vue d'ensemble complète de la nouvelle fonctionnalité permettant aux utilisateurs d'importer leurs dépôts GitHub existants en tant que projets. Il est destiné aux développeurs backend et frontend pour comprendre les changements et mettre en œuvre les intégrations nécessaires.

## 1. Aperçu de la fonctionnalité

Auparavant, la création de projet se limitait à partir de zéro, obligeant les utilisateurs à saisir manuellement tous les détails du projet. Cette fonctionnalité introduit un nouveau flux de travail : les utilisateurs peuvent désormais s'authentifier avec leur compte GitHub, sélectionner l'un de leurs dépôts publics et l'importer. Ce processus remplit automatiquement le titre, la description et l'URL du dépôt GitHub du projet, simplifiant ainsi la configuration du projet.

## 2. Détails de l'implémentation backend

Le backend a été mis à jour pour prendre en charge cette nouvelle méthode de création de projet. Les principaux changements concernent un nouveau module pour les interactions avec GitHub et des modifications de la logique de création de projet existante.

### 2.1. Nouveau module `Github`

Un nouveau module `Github` (`apps/server/src/contexts/github/`) a été créé pour encapsuler toute la logique liée à l'API GitHub.

#### 2.1.1. `GithubController`

-   **Fichier :** `apps/server/src/contexts/github/infrastructure/controllers/github.controller.ts`
-   **Objectif :** Expose de nouveaux points de terminaison pour interagir avec les données GitHub d'un utilisateur.

#### 2.1.2. Nouveau point de terminaison : `GET /v1/github/repos`

C'est le point de terminaison principal pour que le frontend récupère la liste des dépôts qu'un utilisateur peut importer.

-   **URL :** `GET /v1/github/repos`
-   **Méthode HTTP :** `GET`
-   **Authentification :** C'est un point de terminaison protégé. Il utilise le `GithubAuthGuard`, qui repose sur le cookie `sAccessToken` obtenu lors du flux d'authentification SuperTokens. L'utilisateur doit avoir lié son compte GitHub.
-   **Description :** Récupère une liste des dépôts GitHub publics de l'utilisateur authentifié.
-   **Réponse de succès (200 OK) :** Renvoie un objet JSON contenant une liste de dépôts.
-   **Réponse d'erreur (404 Not Found) :** Se produit si l'utilisateur n'est pas trouvé ou n'a pas de dépôts.

### 2.2. Modifications du module `Project`

Le module `Project` existant a été adapté pour gérer les deux méthodes de création de projet : "à partir de zéro" et "depuis GitHub".

#### 2.2.1. `ProjectController`

-   **Fichier :** `apps/server/src/contexts/project/infrastructure/controllers/project.controller.ts`
-   **Changement :** Le point de terminaison `createProject` accepte désormais un paramètre de requête `method`.
    -   `POST /v1/projects?method=scratch` (Comportement par défaut/hérité)
    -   `POST /v1/projects?method=github` (Nouveau comportement d'importation)

#### 2.2.2. `CreateProjectCommandHandler`

-   **Fichier :** `apps/server/src/contexts/project/use-cases/commands/create/create-project.command.ts`
-   **Changement :** La logique du gestionnaire se divise maintenant en fonction du paramètre `method`.
    -   Si `method` est `scratch`, il continue comme avant, créant un nouveau dépôt GitHub pour le projet.
    -   Si `method` est `github`, il valide l'URL GitHub fournie dans le corps de la requête et la lie au nouveau projet. Il ne crée **pas** de nouveau dépôt sur GitHub.

## 3. Guide d'implémentation frontend

Cette section fournit un guide étape par étape pour les développeurs frontend afin d'intégrer la fonctionnalité d'importation.

### Étape 1 : Assurer l'authentification GitHub

Avant qu'un utilisateur puisse importer un dépôt, il doit s'être authentifié avec GitHub via le flux d'authentification existant de l'application. Ce processus doit aboutir à la définition d'un cookie `sAccessToken` dans son navigateur, qui est requis pour l'étape suivante.

### Étape 2 : Récupérer les dépôts GitHub de l'utilisateur

Lorsque l'utilisateur accède à la page ou à la modale "Importer depuis GitHub", effectuez une requête `GET` vers le nouveau point de terminaison `/v1/github/repos` pour récupérer ses dépôts.

**Exemple de requête avec `fetch` :**

```javascript
async function fetchGithubRepos() {
  try {
    const response = await fetch('/v1/github/repos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Le navigateur inclura automatiquement le cookie sAccessToken
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Échec de la récupération des dépôts');
    }

    const data = await response.json();
    return data.repositories;
  } catch (error) {
    console.error('Erreur lors de la récupération des dépôts GitHub :', error);
    // Afficher un message d'erreur à l'utilisateur
    return [];
  }
}
```

**Exemple de commande `curl` pour les tests :**

```bash
# Remplacez VOTRE_COOKIE_DE_SESSION par un jeton valide
curl -X GET http://localhost:3001/v1/github/repos \
  -H "Cookie: sAccessToken=VOTRE_COOKIE_DE_SESSION"
```

**Exemple de réponse de succès (`200 OK`) :**

```json
{
  "repositories": [
    {
      "owner": "JaneDoe",
      "title": "mon-super-projet",
      "description": "Une description de mon super projet.",
      "url": "https://github.com/JaneDoe/mon-super-projet"
    },
    {
      "owner": "JaneDoe",
      "title": "un-autre-depot",
      "description": null,
      "url": "https://github.com/JaneDoe/un-autre-depot"
    }
  ]
}
```

### Étape 3 : Interface utilisateur pour la sélection du dépôt

-   Affichez les dépôts récupérés dans une liste ou un menu déroulant.
-   Lorsque l'utilisateur sélectionne un dépôt, utilisez son `title`, `description` et `url` pour pré-remplir le formulaire de création de projet.
-   L'utilisateur doit ensuite être invité à remplir les détails restants du projet qui ne sont pas disponibles sur GitHub (par exemple, `technologies`, `roles`, `projectGoals`, `image`).

### Étape 4 : Soumettre le formulaire de création de projet

Une fois le formulaire rempli, soumettez-le au point de terminaison `POST /v1/projects` avec le paramètre de requête `method=github`.

**Exemple de requête avec `fetch` :**

```javascript
async function createProjectFromGithub(projectData) {
  try {
    const response = await fetch('/v1/projects?method=github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Le navigateur inclura automatiquement le cookie sAccessToken
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Échec de la création du projet');
    }

    const newProject = await response.json();
    console.log('Projet créé avec succès :', newProject);
    // Rediriger vers la page du nouveau projet ou afficher un message de succès
    return newProject;
  } catch (error) {
    console.error('Erreur lors de la création du projet :', error);
    // Afficher un message d'erreur à l'utilisateur
    return null;
  }
}

// Exemple d'utilisation :
const selectedRepo = {
  "owner": "JaneDoe",
  "title": "mon-super-projet",
  "description": "Une description de mon super projet.",
  "url": "https://github.com/JaneDoe/mon-super-projet"
};

const projectDetailsFromForm = {
  technologies: ["NestJS", "React", "PostgreSQL"],
  roles: [{ name: "Développeur Backend", description: "Développe l'API" }],
  projectGoals: [{ goal: "Atteindre 100 utilisateurs" }],
  image: "https://example.com/project-image.png"
};

const requestBody = {
  title: selectedRepo.title,
  description: selectedRepo.description,
  externalLinks: [{ type: 'github', url: selectedRepo.url }],
  ...projectDetailsFromForm
};

createProjectFromGithub(requestBody);
```

**Exemple de commande `curl` pour les tests :**

```bash
# Remplacez VOTRE_COOKIE_DE_SESSION par un jeton valide
curl -X POST 'http://localhost:3001/v1/projects?method=github' \
-H "Content-Type: application/json" \
-H "Cookie: sAccessToken=VOTRE_COOKIE_DE_SESSION" \
-d '{
  "title": "mon-super-projet",
  "description": "Une description de mon super projet.",
  "technologies": ["NestJS", "React", "PostgreSQL"],
  "roles": [
    { "name": "Développeur Backend", "description": "Développe l'API" },
    { "name": "Développeur Frontend", "description": "Développe l'UI" }
  ],
  "projectGoals": [
    { "goal": "Mettre en œuvre l'authentification des utilisateurs" },
    { "goal": "Déployer en production" }
  ],
  "externalLinks": [
    { "type": "github", "url": "https://github.com/JaneDoe/mon-super-projet" }
  ],
  "image": ""
}'
```

**Exemple de réponse de succès (`201 Created`) :**

L'API répondra avec l'objet du projet nouvellement créé, y compris son ID généré et d'autres détails.

```json
{
    "id": "clxun7j2d000008l7hyp6b7a9",
    "ownerId": "clxun7fpl000108l74y27a8x5",
    "title": "mon-super-projet",
    "description": "Une description de mon super projet.",
    "image": null,
    "status": "recruiting",
    "createdAt": "2025-07-21T10:00:00.000Z",
    "updatedAt": "2025-07-21T10:00:00.000Z",
    "technologies": ["NestJS", "React", "PostgreSQL"],
    "roles": [
        {
            "id": "clxun7j2d000208l7c3yqg8w9",
            "name": "Développeur Backend",
            "description": "Développe l'API"
        },
        {
            "id": "clxun7j2d000308l7e2fnh7k8",
            "name": "Développeur Frontend",
            "description": "Développe l'UI"
        }
    ],
    "externalLinks": [
        {
            "type": "github",
            "url": "https://github.com/JaneDoe/mon-super-projet"
        }
    ]
    // ... et autres champs du projet
}
```

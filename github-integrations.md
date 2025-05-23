# Github integrations

## Préambule

Pour l'authentification, les utilisateurs lieront leur compte a Github via la GithubApp OST, et se verront décerner un token Github App, qu'ils utiliseront pour s'authentifier. Nous utiliserons ce token pour effectuer les requêtes à l'API Github. Nous veillerons donc à ce que les routes API à utiliser disposent des droits sur les tokens Github App.

## Outils

[OctoKit](https://github.com/octokit/octokit.js) : SDK NodeJS de Github pour accéder à leur API.

[Specifications](https://docs.github.com/en/rest?apiVersion=2022-11-28) : Specs officielles au format OpenAPI

## Scenario

### Création de projet simple

L'utilisateur crée un Projet OST, l'explique et monte sa Team.

Une fois la maquête du Projet finalisée et la Team montée,
on [crée le Repository correspondant au Projet](#cp-md-0-cr-er-un-repo-pour-un-user)

## Use cases

### Créer un Repo pour un User

requête : POST /user/repos

permissions : 
- public_repo > pour créer un repository publique
- repo > pour créer un repository privé ou publique

example :

``` js
await octokit.request('POST /user/repos', {
  name: 'Hello-World',  // required
  description: 'This is your first repo!',
  homepage: 'https://github.com',
  'private': true,
  is_template: false,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})
```

returns :


[Documentation API](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#create-a-repository-for-the-authenticated-user)

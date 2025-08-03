import { FindOrganizationRepositoriesQueryHandler } from './find-organization-repositories.query';
import { FindUserGitHubCredentialsQueryHandler } from './find-user-github-credentials.query';

export const githubQueriesContainer = [
  FindUserGitHubCredentialsQueryHandler,
  FindOrganizationRepositoriesQueryHandler,
];

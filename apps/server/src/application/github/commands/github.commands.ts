import {
  CreateGitHubRepositoryCommand,
  CreateGitHubRepositoryCommandHandler,
} from './create-github-repository.command';

export const githubCommandsContainer = [
  CreateGitHubRepositoryCommandHandler,
  CreateGitHubRepositoryCommand,
];

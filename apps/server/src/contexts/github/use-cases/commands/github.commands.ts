import { CreateGitHubRepositoryCommandHandler } from './create-github-repository.command';
import { CreateUserGhTokenCommandHandler } from './create-user-gh-token.command';
import { UpdateUserGhTokenCommandHandler } from './update-user-gh-token.command';

export const githubCommandsContainer = [
  CreateGitHubRepositoryCommandHandler,
  CreateUserGhTokenCommandHandler,
  UpdateUserGhTokenCommandHandler,
];

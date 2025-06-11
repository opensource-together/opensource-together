import {
  CreateUserCommand,
  CreateUserCommandHandler,
} from './create-user.command';
import {
  UpdateGithubTokenUserCommand,
  UpdateGithubTokenUserCommandHandler,
} from './update-user-gh-token.command';

export const userCommandsContainer = [
  CreateUserCommand,
  CreateUserCommandHandler,
  UpdateGithubTokenUserCommand,
  UpdateGithubTokenUserCommandHandler,
];

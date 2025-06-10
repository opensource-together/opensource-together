import {
  CreateUserCommand,
  CreateUserCommandHandler,
} from './create-user.command';
import {
  UpdateGithubTokenUserCommand,
  UpdateGithubTokenUserCommandHandler,
} from './update-user.command';

export const userCommandsContainer = [
  CreateUserCommand,
  CreateUserCommandHandler,
  UpdateGithubTokenUserCommand,
  UpdateGithubTokenUserCommandHandler,
];

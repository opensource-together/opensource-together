import {
  CreateUserCommand,
  CreateUserCommandHandler,
} from './create-user.command';
import {
  UpdateUserGhTokenCommand,
  UpdateUserGhTokenCommandHandler,
} from './update-user-gh-token.command';

export const userCommandsContainer = [
  CreateUserCommand,
  CreateUserCommandHandler,
  UpdateUserGhTokenCommand,
  UpdateUserGhTokenCommandHandler,
];

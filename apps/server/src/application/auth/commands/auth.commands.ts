import { RegisterUserCommand } from './register-user.command';
import { RegisterUserCommandHandler } from './register-user.command';
import { SignInUserCommandHandler } from './signin-user.command';
import { SignInUserCommand } from './signin-user.command';

export const authCommandsContainer = [
  RegisterUserCommand,
  RegisterUserCommandHandler,
  SignInUserCommand,
  SignInUserCommandHandler,
];

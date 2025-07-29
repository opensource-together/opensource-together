import { ApplyToProjectRoleCommandHandler } from './apply-to-project-role.command';
import { AcceptUserApplicationCommandHandler } from './accept-user-application.command';
import { RejectUserApplicationCommandHandler } from './reject-user-application.command';
export const projectRoleApplicationCommandsContainer = [
  ApplyToProjectRoleCommandHandler,
  AcceptUserApplicationCommandHandler,
  RejectUserApplicationCommandHandler,
];

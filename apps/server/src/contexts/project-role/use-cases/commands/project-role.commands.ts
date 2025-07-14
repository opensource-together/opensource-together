import { CreateProjectRoleCommandHandler } from './create-project-role.command';
import { UpdateProjectRoleCommandHandler } from './update-project-role.command';
// import { DeleteProjectRoleCommandHandler } from './delete-project-role.command';

export const projectRoleCommandsContainer = [
  CreateProjectRoleCommandHandler,
  UpdateProjectRoleCommandHandler,
  //   DeleteProjectRoleCommandHandler,
];

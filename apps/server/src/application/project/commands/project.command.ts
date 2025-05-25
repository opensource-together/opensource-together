import {
  CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create/create-project.command';
import {
  UpdateProjectCommand,
  UpdateProjectCommandHandler,
} from './update/update-project.usecase';

export const projectCommandsContainer = [
  CreateProjectCommand,
  CreateProjectCommandHandler,
  UpdateProjectCommand,
  UpdateProjectCommandHandler,
];

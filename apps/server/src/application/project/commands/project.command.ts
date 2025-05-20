import {
  CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create/create-project.usecase';
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

import {
  CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create/create-project.command';
import {
  UpdateProjectCommand,
  UpdateProjectCommandHandler,
} from './update/update-project.command';
import {
  DeleteProjectCommand,
  DeleteProjectCommandHandler,
} from './delete/delete-project.command';

export const projectCommandsContainer = [
  CreateProjectCommand,
  CreateProjectCommandHandler,
  UpdateProjectCommand,
  UpdateProjectCommandHandler,
  DeleteProjectCommand,
  DeleteProjectCommandHandler,
];

import {
  // CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create/create-project.command';
import { DeleteProjectCommandHandler } from './delete/delete-project.command';
import { UpdateProjectCommandHandler } from './update/update-project.command';

export const projectCommandsContainer = [
  // CreateProjectCommand,
  CreateProjectCommandHandler,
  DeleteProjectCommandHandler,
  UpdateProjectCommandHandler,
];

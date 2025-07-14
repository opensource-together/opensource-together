import {
  // CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create/create-project.command';
import { DeleteProjectCommandHandler } from './delete/delete-project.command';

export const projectCommandsContainer = [
  // CreateProjectCommand,
  CreateProjectCommandHandler,
  DeleteProjectCommandHandler,
];

import {
  // CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create/create-project.command';
import { UpdateProjectCommandHandler } from './update/update-project.command';

export const projectCommandsContainer = [
  // CreateProjectCommand,
  CreateProjectCommandHandler,
  UpdateProjectCommandHandler,
];

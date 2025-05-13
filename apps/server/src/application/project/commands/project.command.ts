import {
  CreateProjectCommand,
  CreateProjectCommandHandler,
} from './create-project.usecase';

export const projectCommandsContainer = [
  CreateProjectCommand,
  CreateProjectCommandHandler,
];

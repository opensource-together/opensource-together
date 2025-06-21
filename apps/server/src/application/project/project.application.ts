import { projectQueriesContainer } from '@/application/project/queries/project.queries';
import { projectCommandsContainer } from '@/application/project/commands/project.command';

export const projectApplicationContainer = [
  ...projectQueriesContainer,
  ...projectCommandsContainer,
];

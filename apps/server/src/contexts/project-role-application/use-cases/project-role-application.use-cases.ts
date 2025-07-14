import { projectRoleApplicationCommandsContainer } from './commands/project-role-application.commands';
import { ProjectRoleApplicationQueries } from './queries/project-role-application.queries';

export const projectRoleApplicationUseCases = [
  ...projectRoleApplicationCommandsContainer,
  ...ProjectRoleApplicationQueries,
];

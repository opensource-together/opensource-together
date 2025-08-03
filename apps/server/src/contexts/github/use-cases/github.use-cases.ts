import { githubCommandsContainer } from './commands/github.commands';
import { githubQueriesContainer } from './queries/github.queries';

export const githubUseCases = [
  ...githubCommandsContainer,
  ...githubQueriesContainer,
];

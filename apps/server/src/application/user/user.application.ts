import { userQueriesContainer } from './queries/user.queries';
import { userCommandsContainer } from './commands/user.commands';
export const userApplicationContainer = [
  ...userQueriesContainer,
  ...userCommandsContainer,
];

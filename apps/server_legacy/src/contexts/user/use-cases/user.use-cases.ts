import { userQueriesContainer } from './queries/user-queries.container';
import { userCommandsContainer } from './commands/user-commands.container';
export const userUseCases = [...userQueriesContainer, ...userCommandsContainer];

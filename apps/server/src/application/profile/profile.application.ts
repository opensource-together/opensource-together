import { profileCommands } from './commands/profile.commands';
import { profileQueries } from './queries/profile.queries';

export const profileApplication = [...profileCommands, ...profileQueries];

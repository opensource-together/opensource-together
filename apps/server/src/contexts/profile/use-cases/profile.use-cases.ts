import { ProfileCommandHandlers } from '@/contexts/profile/use-cases/commands/profile-commands.container';
import { profileQueriesContainer } from '@/contexts/profile/use-cases/queries/profile-queries.container';

export const profileUseCases = [
  ...ProfileCommandHandlers,
  ...profileQueriesContainer,
];

import { FindUserByEmailQueryHandler } from './find-user-by-email.query';
import { FindUserByIdQueryHandler } from './find-user-by-id.query';
import { UserExistHandler } from './user-exist.query';
import { FindUserByUsernameQueryHandler } from './find-user-by-username.query';
import { FindUserApplicationsQueryHandler } from './find-user-applications.query';
import { FindUserGitHubStatsQueryHandler } from './find-user-github-stats.query';

export const userQueriesContainer = [
  FindUserByEmailQueryHandler,
  FindUserByIdQueryHandler,
  UserExistHandler,
  FindUserByUsernameQueryHandler,
  FindUserApplicationsQueryHandler,
  FindUserGitHubStatsQueryHandler,
];

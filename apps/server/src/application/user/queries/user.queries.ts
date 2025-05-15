import { FindUserByEmailQueryHandler } from './find-user-by-email.query';
import { FindUserByIdQueryHandler } from './find-user-by-id.query';
import { UserExistHandler } from './user-exist.query';
import { FindUserByUsernameQueryHandler } from './find-user-by-username.query';
export const userQueriesContainer = [
  FindUserByEmailQueryHandler,
  FindUserByIdQueryHandler,
  UserExistHandler,
  FindUserByUsernameQueryHandler,
];

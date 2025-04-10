import { UserExistHandler } from '@infrastructures/cqrs/user/queries/user-exist.handler';
import { FindEmailByUsernameHandler } from '@infrastructures/cqrs/user/queries/find-email-by-username.handler';
export const userHandlerContainer = [
  UserExistHandler,
  FindEmailByUsernameHandler,
];

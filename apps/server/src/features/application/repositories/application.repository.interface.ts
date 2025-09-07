import { Result } from '@/libs/result';
import { Application } from '../domain/application';

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');

export interface ApplicationRepository {
  create(application: Application): Promise<Result<Application, string>>;
}

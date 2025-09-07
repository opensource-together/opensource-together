import { Result } from '@/libs/result';
import {
  ApplicationProjectRole,
  ApplicationStatus,
} from '../domain/application';

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');

export interface ApplicationRepository {
  applyToProjectRole(application: {
    projectRoleId: string;
    userId: string;
    status: ApplicationStatus;
    motivationLetter: string;
    projectId: string;
  }): Promise<Result<ApplicationProjectRole, string>>;
  existsStatusApplication(
    userId: string,
    projectRoleId: string,
  ): Promise<Result<ApplicationStatus, string>>;
}

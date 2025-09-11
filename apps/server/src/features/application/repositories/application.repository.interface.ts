import { Result } from '@/libs/result';
import {
  ApplicationProjectRole,
  ApplicationStatus,
} from '../domain/application';

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');

export interface ApplicationRepository {
  findById(id: string): Promise<Result<ApplicationProjectRole, string>>;
  findByRoleId(roleId: string): Promise<Result<ApplicationProjectRole, string>>;
  findAllByProjectId(
    projectId: string,
  ): Promise<Result<ApplicationProjectRole[], string>>;
  findAllByUserId(
    userId: string,
  ): Promise<Result<ApplicationProjectRole[], string>>;
  applyToProjectRole(application: {
    projectRoleId: string;
    userId: string;
    status: ApplicationStatus;
    keyFeatures: string[];
    motivationLetter: string;
    projectId: string;
  }): Promise<Result<ApplicationProjectRole, string>>;
  existsStatusApplication(
    userId: string,
    projectRoleId: string,
  ): Promise<Result<ApplicationStatus, string>>;
  cancelApplication(props: {
    applicationId: string;
    userId: string;
  }): Promise<Result<void, string>>;
  acceptApplication(props: {
    applicationId: string;
    userId: string;
  }): Promise<Result<void, string>>;
  rejectApplication(props: {
    applicationId: string;
    userId: string;
    rejectionReason?: string;
  }): Promise<Result<void, string>>;
}

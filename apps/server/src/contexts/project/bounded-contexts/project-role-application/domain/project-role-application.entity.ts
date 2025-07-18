import { Result } from '@/libs/result';

export type ApplicationStatus = 'PENDING' | 'APPROVAL' | 'REJECTED';

export type ProjectRoleApplicationData = {
  id?: string;
  projectId: string;
  projectRoleTitle: string;
  projectRoleId: string;
  status: ApplicationStatus;
  motivationLetter?: string;
  selectedKeyFeatures: string[];
  selectedProjectGoals: string[];
  rejectionReason?: string;
  appliedAt?: Date;
  decidedAt?: Date;
  decidedBy?: string;
  userProfile: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
};

export type ProjectRoleApplicationValidationErrors = {
  projectRoleId?: string;
  selectedKeyFeatures?: string;
  selectedProjectGoals?: string;
  motivationLetter?: string;
  rejectionReason?: string;
  status?: string;
};

export class ProjectRoleApplication {
  public readonly id?: string;
  public readonly projectId: string;
  public readonly projectRoleTitle: string;
  public readonly projectRoleId: string;
  public status: ApplicationStatus;
  public readonly motivationLetter?: string;
  public readonly selectedKeyFeatures: string[];
  public readonly selectedProjectGoals: string[];
  public rejectionReason?: string;
  public readonly appliedAt: Date;
  public decidedAt?: Date;
  public decidedBy?: string;
  public readonly userProfile: {
    id: string;
    name: string;
    avatarUrl?: string;
  };

  private constructor(props: {
    id?: string;
    projectId: string;
    projectRoleTitle: string;
    projectRoleId: string;
    status: ApplicationStatus;
    motivationLetter?: string;
    selectedKeyFeatures: string[];
    selectedProjectGoals: string[];
    rejectionReason?: string;
    appliedAt?: Date;
    decidedAt?: Date;
    decidedBy?: string;
    userProfile: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
  }) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.projectRoleTitle = props.projectRoleTitle;
    this.projectRoleId = props.projectRoleId;
    this.status = props.status;
    this.motivationLetter = props.motivationLetter;
    this.selectedKeyFeatures = props.selectedKeyFeatures;
    this.selectedProjectGoals = props.selectedProjectGoals;
    this.rejectionReason = props.rejectionReason;
    this.appliedAt = props.appliedAt ?? new Date();
    this.decidedAt = props.decidedAt;
    this.decidedBy = props.decidedBy;
    this.userProfile = props.userProfile!;
  }

  private static validate(
    props: ProjectRoleApplicationData,
  ): Result<void, ProjectRoleApplicationValidationErrors | string> {
    const errors: ProjectRoleApplicationValidationErrors = {};

    if (!props.projectRoleId || props.projectRoleId.trim() === '') {
      errors.projectRoleId = 'Project role ID is required';
    }

    if (!props.selectedKeyFeatures || props.selectedKeyFeatures.length === 0) {
      errors.selectedKeyFeatures = 'At least one key feature must be selected';
    }

    if (
      !props.selectedProjectGoals ||
      props.selectedProjectGoals.length === 0
    ) {
      errors.selectedProjectGoals =
        'At least one project goal must be selected';
    }

    if (props.motivationLetter && props.motivationLetter.length > 1000) {
      errors.motivationLetter =
        'Motivation letter must be less than 1000 characters';
    }

    if (props.rejectionReason && props.rejectionReason.length > 500) {
      errors.rejectionReason =
        'Rejection reason must be less than 500 characters';
    }

    if (
      props.status &&
      !['PENDING', 'APPROVAL', 'REJECTED'].includes(props.status)
    ) {
      errors.status = 'Status must be PENDING, APPROVAL, or REJECTED';
    }

    // userProfile est optionnel, pas de validation nécessaire

    if (Object.keys(errors).length > 0) {
      return Result.fail(errors);
    }

    return Result.ok(undefined);
  }

  public static create(
    props: Omit<ProjectRoleApplicationData, 'status'>,
  ): Result<
    ProjectRoleApplication,
    ProjectRoleApplicationValidationErrors | string
  > {
    const propsWithStatus: ProjectRoleApplicationData = {
      ...props,
      status: 'PENDING',
    };

    const validationResult = this.validate(propsWithStatus);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(new ProjectRoleApplication(propsWithStatus));
  }

  public static reconstitute(
    props: ProjectRoleApplicationData,
  ): Result<
    ProjectRoleApplication,
    ProjectRoleApplicationValidationErrors | string
  > {
    const validationResult = this.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(new ProjectRoleApplication(props));
  }

  public approve(
    decidedBy: string,
  ): Result<void, ProjectRoleApplicationValidationErrors | string> {
    if (this.status !== 'PENDING') {
      return Result.fail({
        status: 'Application must be pending to be approved',
      });
    }

    this.status = 'APPROVAL';
    this.decidedAt = new Date();
    this.decidedBy = decidedBy;
    this.rejectionReason = undefined;

    return Result.ok(undefined);
  }

  public reject(
    decidedBy: string,
    reason?: string,
  ): Result<void, ProjectRoleApplicationValidationErrors | string> {
    if (this.status !== 'PENDING') {
      return Result.fail({
        status: 'Application must be pending to be rejected',
      });
    }

    if (reason && reason.length > 500) {
      return Result.fail({
        rejectionReason: 'Rejection reason must be less than 500 characters',
      });
    }

    this.status = 'REJECTED';
    this.decidedAt = new Date();
    this.decidedBy = decidedBy;
    this.rejectionReason = reason;

    return Result.ok(undefined);
  }

  public toPrimitive(): ProjectRoleApplicationData {
    return {
      id: this.id,
      projectId: this.projectId,
      projectRoleTitle: this.projectRoleTitle,
      projectRoleId: this.projectRoleId,
      status: this.status,
      motivationLetter: this.motivationLetter,
      selectedKeyFeatures: [...this.selectedKeyFeatures],
      selectedProjectGoals: [...this.selectedProjectGoals],
      rejectionReason: this.rejectionReason,
      appliedAt: this.appliedAt,
      decidedAt: this.decidedAt,
      decidedBy: this.decidedBy,
      userProfile: this.userProfile,
    };
  }

  public canUserModify(userId: string): boolean {
    return this.userProfile?.id === userId && this.status === 'PENDING';
  }

  public isPending(): boolean {
    return this.status === 'PENDING';
  }

  public isApproved(): boolean {
    return this.status === 'APPROVAL';
  }

  public isRejected(): boolean {
    return this.status === 'REJECTED';
  }
}

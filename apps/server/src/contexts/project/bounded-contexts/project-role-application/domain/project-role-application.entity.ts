import { Result } from '@/libs/result';
import { KeyFeature } from '../../project-key-feature/domain/key-feature.entity';
import { ProjectGoals } from '../../project-goals/domain/project-goals.entity';

export type ApplicationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CANCELLED';

export type ProjectRoleApplicationValidationErrors = {
  projectRoleId?: string;
  selectedKeyFeatures?: string;
  selectedProjectGoals?: string;
  motivationLetter?: string;
  rejectionReason?: string;
  status?: string;
};

export type ProjectRoleApplicationCreateData = {
  id?: string;
  projectId: string;
  project: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    image?: string;
    owner: {
      id: string;
      username: string;
      login: string;
      email: string;
      provider: string;
      jobTitle: string | null;
      location: string | null;
      company: string | null;
      bio: string | null;
      createdAt: Date;
      updatedAt: Date;
      avatarUrl: string | null;
    };
  };
  projectRoleTitle: string;
  projectRoleId: string;
  motivationLetter?: string;
  selectedKeyFeatures: { id: string; feature: string }[];
  selectedProjectGoals: { id: string; goal: string }[];
  userProfile: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
};

export class ProjectRoleApplication {
  public readonly id?: string;
  public readonly projectId: string;
  public readonly project: {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    image?: string;
    owner: {
      id: string;
      username: string;
      login: string;
      email: string;
      provider: string;
      jobTitle: string | null;
      location: string | null;
      company: string | null;
      bio: string | null;
      createdAt: Date;
      updatedAt: Date;
      avatarUrl: string | null;
    };
  };
  public readonly projectRoleTitle: string;
  public readonly projectRoleId: string;
  public status: ApplicationStatus;
  public readonly motivationLetter?: string;
  public readonly selectedKeyFeatures: KeyFeature[];
  public readonly selectedProjectGoals: ProjectGoals[];
  public rejectionReason?: string;
  public readonly appliedAt: Date;
  public decidedAt?: Date;
  public decidedBy?: string;
  public readonly userProfile: {
    id: string;
    username: string;
    avatarUrl?: string;
  };

  private constructor(props: {
    id?: string;
    projectId: string;
    project: {
      id: string;
      title: string;
      shortDescription: string;
      description: string;
      image?: string;
      owner: {
        id: string;
        username: string;
        login: string;
        email: string;
        provider: string;
        jobTitle: string | null;
        location: string | null;
        company: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
      };
    };
    projectRoleTitle: string;
    projectRoleId: string;
    status: ApplicationStatus;
    motivationLetter?: string;
    selectedKeyFeatures: KeyFeature[];
    selectedProjectGoals: ProjectGoals[];
    rejectionReason?: string;
    appliedAt?: Date;
    decidedAt?: Date;
    decidedBy?: string;
    userProfile: {
      id: string;
      username: string;
      avatarUrl?: string;
    };
  }) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.project = props.project;
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

  public static create(
    props: ProjectRoleApplicationCreateData,
  ): Result<
    ProjectRoleApplication,
    ProjectRoleApplicationValidationErrors | string
  > {
    const propsWithStatus = {
      ...props,
      status: 'PENDING' as ApplicationStatus,
    };

    const selectedKeyFeaturesResult = props.selectedKeyFeatures.map((kf) =>
      KeyFeature.reconstitute({
        id: kf.id,
        projectId: props.projectId,
        feature: kf.feature,
      }),
    );
    const selectedProjectGoalsResult = props.selectedProjectGoals.map((pg) =>
      ProjectGoals.reconstitute({
        id: pg.id,
        projectId: props.projectId,
        goal: pg.goal,
      }),
    );

    if (!selectedKeyFeaturesResult.every((kf) => kf.success)) {
      return Result.fail('Invalid key features');
    }

    if (!selectedProjectGoalsResult.every((pg) => pg.success)) {
      return Result.fail('Invalid project goals');
    }
    const validationResult = this.validate(propsWithStatus);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(
      new ProjectRoleApplication({
        ...propsWithStatus,
        selectedKeyFeatures: selectedKeyFeaturesResult.map((kf) => kf.value),
        selectedProjectGoals: selectedProjectGoalsResult.map((pg) => pg.value),
      }),
    );
  }

  public static reconstitute(props: {
    id?: string;
    projectId: string;
    projectTitle: string;
    projectDescription?: string;
    project: {
      id: string;
      title: string;
      shortDescription: string;
      description: string;
      image?: string;
      owner: {
        id: string;
        username: string;
        login: string;
        email: string;
        provider: string;
        jobTitle: string | null;
        location: string | null;
        company: string | null;
        bio: string | null;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
      };
    };
    projectRoleTitle: string;
    projectRoleId: string;
    status: ApplicationStatus;
    motivationLetter?: string;
    selectedKeyFeatures: { id: string; feature: string }[];
    selectedProjectGoals: { id: string; goal: string }[];
    rejectionReason?: string;
    appliedAt?: Date;
    decidedAt?: Date;
    decidedBy?: string;
    userProfile: {
      id: string;
      username: string;
      avatarUrl?: string;
    };
  }): Result<
    ProjectRoleApplication,
    ProjectRoleApplicationValidationErrors | string
  > {
    const validationResult = this.validate(props);
    const selectedKeyFeaturesResult = props.selectedKeyFeatures.map((kf) =>
      KeyFeature.reconstitute({
        id: kf.id,
        projectId: props.projectId,
        feature: kf.feature,
      }),
    );
    const selectedProjectGoalsResult = props.selectedProjectGoals.map((pg) =>
      ProjectGoals.reconstitute({
        id: pg.id,
        projectId: props.projectId,
        goal: pg.goal,
      }),
    );

    if (!selectedKeyFeaturesResult.every((kf) => kf.success)) {
      return Result.fail('Invalid key features');
    }

    if (!selectedProjectGoalsResult.every((pg) => pg.success)) {
      return Result.fail('Invalid project goals');
    }

    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(
      new ProjectRoleApplication({
        ...props,
        selectedKeyFeatures: selectedKeyFeaturesResult.map((kf) => kf.value),
        selectedProjectGoals: selectedProjectGoalsResult.map((pg) => pg.value),
      }),
    );
  }

  private static validate(props: {
    projectRoleId: string;
    selectedKeyFeatures: { id: string; feature: string }[];
    selectedProjectGoals: { id: string; goal: string }[];
    motivationLetter?: string;
    rejectionReason?: string;
    status?: ApplicationStatus;
  }): Result<void, ProjectRoleApplicationValidationErrors | string> {
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
      !['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'].includes(props.status)
    ) {
      errors.status =
        'Status must be PENDING, ACCEPTED, REJECTED, or CANCELLED';
    }

    // userProfile est optionnel, pas de validation nécessaire

    if (Object.keys(errors).length > 0) {
      return Result.fail(errors);
    }

    return Result.ok(undefined);
  }
  public approve(
    decidedBy: string,
  ): Result<void, ProjectRoleApplicationValidationErrors | string> {
    if (this.status !== 'PENDING') {
      return Result.fail({
        status: 'Application must be pending to be approved',
      });
    }

    this.status = 'ACCEPTED';
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

  public toPrimitive() {
    return {
      id: this.id,
      projectId: this.projectId,
      project: this.project,
      projectRoleTitle: this.projectRoleTitle,
      projectRoleId: this.projectRoleId,
      status: this.status,
      motivationLetter: this.motivationLetter,
      selectedKeyFeatures: this.selectedKeyFeatures.map((kf) => ({
        id: kf.toPrimitive().id!,
        feature: kf.toPrimitive().feature,
      })),
      selectedProjectGoals: this.selectedProjectGoals.map((pg) => ({
        id: pg.toPrimitive().id!,
        goal: pg.toPrimitive().goal,
      })),
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
    return this.status === 'ACCEPTED';
  }

  public isRejected(): boolean {
    return this.status === 'REJECTED';
  }
}

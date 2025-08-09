import { Result } from '@/libs/result';

export interface TeamMemberPrimitive {
  id?: string;
  userId: string;
  projectId: string;
  joinedAt: Date;
  projectRoleIds?: string[];
}

export class TeamMember {
  private constructor(
    private readonly _userId: string,
    private readonly _projectId: string,
    private readonly _joinedAt: Date,
    private readonly _id?: string,
    private readonly _projectRoleIds: string[] = [],
  ) {}

  static create(props: TeamMemberPrimitive): Result<TeamMember, string> {
    if (!props.userId) {
      return Result.fail('User ID is required');
    }

    if (!props.projectId) {
      return Result.fail('Project ID is required');
    }

    return Result.ok(
      new TeamMember(
        props.userId,
        props.projectId,
        props.joinedAt || new Date(),
        props.id,
        props.projectRoleIds || [],
      ),
    );
  }

  get id(): string | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get projectId(): string {
    return this._projectId;
  }

  get joinedAt(): Date {
    return this._joinedAt;
  }

  get projectRoleIds(): string[] {
    return [...this._projectRoleIds];
  }

  // Méthode pour ajouter un rôle
  addRole(roleId: string): Result<TeamMember, string> {
    if (!roleId) {
      return Result.fail('Role ID is required');
    }

    if (this._projectRoleIds.includes(roleId)) {
      return Result.fail('Role is already assigned to this member');
    }

    const newRoleIds = [...this._projectRoleIds, roleId];
    return Result.ok(
      new TeamMember(
        this._userId,
        this._projectId,
        this._joinedAt,
        this._id,
        newRoleIds,
      ),
    );
  }

  // Méthode pour supprimer un rôle
  removeRole(roleId: string): Result<TeamMember, string> {
    if (!this._projectRoleIds.includes(roleId)) {
      return Result.fail('Role is not assigned to this member');
    }

    const newRoleIds = this._projectRoleIds.filter((id) => id !== roleId);
    return Result.ok(
      new TeamMember(
        this._userId,
        this._projectId,
        this._joinedAt,
        this._id,
        newRoleIds,
      ),
    );
  }

  // Méthode pour vérifier si le membre a un rôle spécifique
  hasRole(roleId: string): boolean {
    return this._projectRoleIds.includes(roleId);
  }

  toPrimitive(): TeamMemberPrimitive {
    return {
      id: this._id,
      userId: this._userId,
      projectId: this._projectId,
      joinedAt: this._joinedAt,
      projectRoleIds: [...this._projectRoleIds],
    };
  }
}

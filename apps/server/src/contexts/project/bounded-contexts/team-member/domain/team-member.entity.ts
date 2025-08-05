import { Result } from '@/libs/result';

export interface TeamMemberPrimitive {
  id?: string;
  userId: string;
  projectId: string;
  joinedAt: Date;
}

export class TeamMember {
  private constructor(
    private readonly _userId: string,
    private readonly _projectId: string,
    private readonly _joinedAt: Date,
    private readonly _id?: string,
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

  toPrimitive(): TeamMemberPrimitive {
    return {
      id: this._id,
      userId: this._userId,
      projectId: this._projectId,
      joinedAt: this._joinedAt,
    };
  }
}

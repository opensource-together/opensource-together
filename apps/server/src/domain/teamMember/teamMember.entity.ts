import { Project } from '@/contexts/project/domain/project.entity';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';

export class TeamMember {
  private _id?: string;
  private _userId: string;
  private _projectId: string;
  private _joinedAt?: Date;
  private _projectRole?: ProjectRole;
  private _project?: Project;

  constructor({
    id,
    userId,
    projectId,
    joinedAt,
    projectRole,
    project,
  }: {
    id?: string;
    userId: string;
    projectId: string;
    joinedAt?: Date;
    projectRole?: ProjectRole;
    project?: Project;
  }) {
    this._id = id;
    this._userId = userId;
    this._projectId = projectId;
    this._joinedAt = joinedAt;
    this._projectRole = projectRole;
    this._project = project;
  }

  getId() {
    return this._id;
  }

  getUserId() {
    return this._userId;
  }

  getProjectId() {
    return this._projectId;
  }

  getJoinedAt() {
    return this._joinedAt;
  }

  getProjectRole() {
    return this._projectRole;
  }

  getProject() {
    return this._project;
  }
}

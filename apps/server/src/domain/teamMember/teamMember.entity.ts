import { Project } from '@/domain/project/project.entity';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';

export class TeamMember {
  private _id?: string;
  private _userId: string;
  private _projectId: string;
  private _projectRoleId: string;
  private _joinedAt?: Date;
  private _projectRole?: ProjectRole;
  private _project?: Project;

  constructor({
    id,
    userId,
    projectId,
    projectRoleId,
    joinedAt,
    projectRole,
    project,
  }: {
    id?: string;
    userId: string;
    projectId: string;
    projectRoleId: string;
    joinedAt?: Date;
    projectRole?: ProjectRole;
    project?: Project;
  }) {
    this._id = id;
    this._userId = userId;
    this._projectId = projectId;
    this._projectRoleId = projectRoleId;
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

  getProjectRoleId() {
    return this._projectRoleId;
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

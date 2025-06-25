import { TechStack } from '@/domain/techStack/techstack.entity';
import { TeamMember } from '@/domain/teamMember/teamMember.entity';
import { Project } from '@prisma/client';

export class ProjectRole {
  private _id?: string;
  private _projectId?: string;
  private _roleTitle: string;
  private _skillSet: TechStack[];
  private _description: string;
  private _isFilled: boolean;
  private _teamMembers?: TeamMember[];
  private _project?: Project;

  constructor({
    id,
    projectId,
    roleTitle,
    skillSet,
    description,
    isFilled,
  }: {
    id?: string;
    projectId?: string;
    roleTitle: string;
    skillSet: TechStack[];
    description: string;
    isFilled: boolean;
    teamMembers?: TeamMember[];
    project?: Project;
  }) {
    this._id = id;
    this._projectId = projectId;
    this._roleTitle = roleTitle;
    this._skillSet = skillSet;
    this._description = description;
    this._isFilled = isFilled;
  }

  getId() {
    return this._id;
  }

  getProjectId() {
    return this._projectId;
  }

  getDescription() {
    return this._description;
  }

  getIsFilled() {
    return this._isFilled;
  }

  getRoleTitle() {
    return this._roleTitle;
  }

  getSkillSet() {
    return this._skillSet;
  }

  getTeamMembers() {
    return this._teamMembers;
  }

  getProject() {
    return this._project;
  }
}

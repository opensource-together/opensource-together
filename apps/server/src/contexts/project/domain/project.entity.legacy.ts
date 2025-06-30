import { TechStack } from '@/domain/techStack/techstack.entity';
import { Title } from './title/title.vo';
import { Description } from './description/description.vo';
import { Link } from './link/link.vo';
import { TeamMember } from '@/domain/teamMember/teamMember.entity';
import { ProjectRole } from '@/domain/projectRole/projectRole.entity';

/**
 * Domain entity representing a project in the OpenSource Together platform.
 * This entity encapsulates all project-related business logic and enforces domain rules.
 * 
 * @class Project
 * @description A project represents a collaborative open source initiative that can be discovered,
 * joined, and managed through the platform. It contains all necessary information for project
 * management including metadata, team composition, and technical requirements.
 * 
 * @example
 * ```typescript
 * const project = new Project({
 *   id: 'proj-123',
 *   ownerId: 'user-456',
 *   title: new Title('My Open Source Project'),
 *   description: new Description('A revolutionary web application'),
 *   techStacks: [techStack1, techStack2],
 *   difficulty: 'medium',
 *   link: new Link('https://project-website.com'),
 *   githubLink: 'https://github.com/owner/repo',
 *   teamMembers: [member1, member2],
 *   projectRoles: [role1, role2]
 * });
 * ```
 */

export class ProjectLegacy {
  private _id: string | null;
  private _ownerId: string;
  private _title: Title;
  private _description: Description;
  private _techStacks: TechStack[];
  private _difficulty: 'easy' | 'medium' | 'hard';
  private _link: Link | null;
  private _githubLink: string | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;
  private _teamMembers: TeamMember[];
  private _projectRoles: ProjectRole[];

  constructor({
    id,
    ownerId,
    title,
    description,
    techStacks,
    difficulty,
    link,
    githubLink,
    createdAt,
    updatedAt,
    teamMembers,
    projectRoles,
  }: {
    id: string | null;
    ownerId: string;
    title: Title;
    description: Description;
    techStacks: TechStack[];
    difficulty: 'easy' | 'medium' | 'hard';
    link: Link | null;
    githubLink: string;
    createdAt?: Date;
    updatedAt?: Date;
    teamMembers: TeamMember[];
    projectRoles: ProjectRole[];
  }) {
    this._id = id;
    this._ownerId = ownerId;
    this._title = title;
    this._description = description;
    this._techStacks = techStacks;
    this._difficulty = difficulty;
    this._link = link;
    this._githubLink = githubLink;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._teamMembers = teamMembers;
    this._projectRoles = projectRoles;
  }

  public getId() {
    return this._id;
  }

  public getOwnerId() {
    return this._ownerId;
  }

  public getTitle() {
    return this._title.getTitle();
  }

  public getDescription() {
    return this._description.getDescription();
  }

  public getTechStacks() {
    return this._techStacks;
  }

  public getDifficulty() {
    return this._difficulty;
  }

  public getLink() {
    return this._link ? this._link.getLink() : null;
  }

  public getGithubLink() {
    return this._githubLink;
  }

  public getCreatedAt() {
    return this._createdAt;
  }

  public getUpdatedAt() {
    return this._updatedAt;
  }

  public getTeamMembers() {
    return this._teamMembers;
  }

  public getProjectRoles() {
    return this._projectRoles;
  }
}

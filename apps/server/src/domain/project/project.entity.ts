import { TechStack } from '../techStack/techstack.entity';
import { Title } from './title/title.vo';
import { Description } from './description/description.vo';
import { Link } from './link/link.vo';

export class Project {
  private readonly id: string | null;
  private _title: Title;
  private _description: Description;
  private _techStacks: TechStack[];
  private _link: Link | null;
  private _ownerId: string;
  private _projectRoles: object[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor({
    id,
    title,
    description,
    techStacks,
    link,
    ownerId,
    projectRoles,
    createdAt,
    updatedAt,
  }: {
    id: string | null;
    title: Title;
    description: Description;
    techStacks: TechStack[];
    link: Link | null;
    ownerId: string;
    projectRoles: object[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = id;
    this._title = title;
    this._description = description;
    this._techStacks = techStacks;
    this._link = link;
    this._ownerId = ownerId;
    this._projectRoles = projectRoles;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public getId() {
    return this.id;
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

  public getLink() {
    return this._link ? this._link.getLink() : null;
  }

  public getOwnerId() {
    return this._ownerId;
  }

  public getProjectRoles() {
    return this._projectRoles;
  }

  public getCreatedAt() {
    return this._createdAt;
  }

  public getUpdatedAt() {
    return this._updatedAt;
  }
}

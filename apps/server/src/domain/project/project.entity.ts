import { TechStack } from '../techStack/techstack.entity';
import { Title } from './title/title.vo';
import { Description } from './description/description.vo';
import { Status } from './status/status.vo';
import { Link } from './link/link.vo';

export class Project {
  private readonly id: string | null;
  private _title: Title;
  private _description: Description;
  private _techStacks: TechStack[];
  private _link: Link | null;
  private _status: Status | null;
  private _userId: string;

  constructor({
    id,
    title,
    description,
    techStacks,
    link,
    status,
    userId,
  }: {
    id: string | null;
    title: Title;
    description: Description;
    techStacks: TechStack[];
    link: Link | null;
    status: Status | null;
    userId: string;
  }) {
    this.id = id;
    this._title = title;
    this._description = description;
    this._techStacks = techStacks;
    this._link = link;
    this._status = status;
    this._userId = userId;
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

  public getStatus() {
    return this._status ? this._status.getStatus() : null;
  }

  public getUserId() {
    return this._userId;
  }
}

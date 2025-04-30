import { TechStack } from '../techStack/techstack.entity';
import { Title } from './title.vo';
import { Description } from './description.vo';
import { Status } from './status.vo';
import { Link } from './link.vo';

export class Project {
  private readonly id: string | null;
  private title: Title;
  private description: Description;
  private techStacks: TechStack[];
  private link: Link | null;
  private status: Status | null;
  private userId: string;

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
    this.title = title;
    this.description = description;
    this.techStacks = techStacks;
    this.link = link;
    this.status = status;
    this.userId = userId;
  }

  public getId() {
    return this.id;
  }

  public getTitle() {
    return this.title.getTitle();
  }

  public getDescription() {
    return this.description.getDescription();
  }

  public getTechStacks() {
    return this.techStacks;
  }

  public getLink() {
    return this.link ? this.link.getLink() : null;
  }

  public getStatus() {
    return this.status ? this.status.getStatus() : null;
  }

  public getUserId() {
    return this.userId;
  }
}

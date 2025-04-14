export class Project {
  private readonly id: string;
  private title: string;
  private description: string;
  private techStacks: any;
  private link: string | null;
  private status: any;
  private userId: string;

  constructor({ id, title, description, techStacks, link, status, userId }) {
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
    return this.title;
  }

  public getDescription() {
    return this.description;
  }

  public getTechStacks() {
    return this.techStacks;
  }

  public getLink() {
    return this.link;
  }

  public getStatus() {
    return this.status;
  }

  public getUserId() {
    return this.userId;
  }
}

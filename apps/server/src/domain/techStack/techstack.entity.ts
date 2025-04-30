export class TechStack {
  private readonly id: string;
  private readonly name: string;
  private readonly iconUrl: string;

  constructor({ id, name, iconUrl }) {
    this.id = id;
    this.name = name;
    this.iconUrl = iconUrl;
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getIconUrl() {
    return this.iconUrl;
  }
}

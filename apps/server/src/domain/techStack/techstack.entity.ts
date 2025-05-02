export class TechStack {
  private readonly id: string;
  private readonly name: string;
  private readonly iconUrl: string;

  constructor({
    id,
    name,
    iconUrl,
  }: {
    id: string;
    name: string;
    iconUrl: string;
  }) {
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

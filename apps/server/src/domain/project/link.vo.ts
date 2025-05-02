import { Result } from '@/shared/result';

export class Link {
  private constructor(private readonly link: string) {}

  //pas de vérification ?
  static create(link: string): Result<Link> {
    return Result.ok(new Link(link));
  }

  public getLink(): string | null {
    return this.link;
  }

  static fromPersistence(link: string): Link {
    //pas de vérification ?
    return new Link(link);
  }
}

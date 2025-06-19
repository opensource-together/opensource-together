import { Result } from '@/shared/result';

export class ProfileProject {
  private constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly url: string,
  ) {}

  public static create(props: {
    name: string;
    description: string;
    url: string;
  }): Result<ProfileProject, string> {
    if (!props.name || !props.description || !props.url) {
      return Result.fail(
        'Name, description and URL are required for a project.',
      );
    }

    return Result.ok(
      new ProfileProject(props.name, props.description, props.url),
    );
  }
}

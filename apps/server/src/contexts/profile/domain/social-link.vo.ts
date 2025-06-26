import { Result } from '@/shared/result';

export type SocialLinkType = 'github' | 'twitter' | 'linkedin' | 'website';

export class SocialLink {
  private constructor(
    public readonly type: SocialLinkType,
    public readonly url: string,
  ) {}

  public static create(props: {
    type: SocialLinkType;
    url: string;
  }): Result<SocialLink, string> {
    if (!props.url) {
      return Result.fail('URL for a social link cannot be empty.');
    }
    try {
      new URL(props.url);
    } catch {
      return Result.fail('Invalid URL format for social link.');
    }

    return Result.ok(new SocialLink(props.type, props.url));
  }
}

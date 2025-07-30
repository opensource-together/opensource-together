import { Result } from '@/libs/result';

export class GitHubStats {
  private constructor(
    private readonly totalStars: number,
    private readonly contributedRepos: number,
    private readonly commitsThisYear: number,
  ) {}

  public static create(props: {
    totalStars: number;
    contributedRepos: number;
    commitsThisYear: number;
  }): Result<GitHubStats, string> {
    const validationResult = this.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }

    return Result.ok(
      new GitHubStats(
        validationResult.value.totalStars,
        validationResult.value.contributedRepos,
        validationResult.value.commitsThisYear,
      ),
    );
  }

  public static reconstitute(props: {
    totalStars: number;
    contributedRepos: number;
    commitsThisYear: number;
  }): Result<GitHubStats, string> {
    return this.create(props);
  }

  private static validate(props: {
    totalStars: number;
    contributedRepos: number;
    commitsThisYear: number;
  }): Result<
    {
      totalStars: number;
      contributedRepos: number;
      commitsThisYear: number;
    },
    string
  > {
    if (props.totalStars < 0) {
      return Result.fail('Total stars cannot be negative');
    }
    if (props.contributedRepos < 0) {
      return Result.fail('Contributed repos cannot be negative');
    }
    if (props.commitsThisYear < 0) {
      return Result.fail('Commits this year cannot be negative');
    }

    return Result.ok({
      totalStars: props.totalStars,
      contributedRepos: props.contributedRepos,
      commitsThisYear: props.commitsThisYear,
    });
  }

  public getTotalStars(): number {
    return this.totalStars;
  }

  public getContributedRepos(): number {
    return this.contributedRepos;
  }

  public getCommitsThisYear(): number {
    return this.commitsThisYear;
  }

  public toPrimitive() {
    return {
      totalStars: this.totalStars,
      contributedRepos: this.contributedRepos,
      commitsThisYear: this.commitsThisYear,
    };
  }

  public updateStats(props: {
    totalStars?: number;
    contributedRepos?: number;
    commitsThisYear?: number;
  }): Result<GitHubStats, string> {
    return GitHubStats.create({
      totalStars: props.totalStars ?? this.totalStars,
      contributedRepos: props.contributedRepos ?? this.contributedRepos,
      commitsThisYear: props.commitsThisYear ?? this.commitsThisYear,
    });
  }
}

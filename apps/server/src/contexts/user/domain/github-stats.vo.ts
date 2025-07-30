import { Result } from '@/libs/result';

export interface ContributionDay {
  date: string; // Format: "YYYY-MM-DD"
  count: number;
  level: number; // 0-4 (pour la couleur)
}
export interface ContributionWeek {
  days: ContributionDay[];
}
export interface ContributionGraph {
  weeks: ContributionWeek[];
  totalContributions: number;
  maxContributions: number;
}

export class GitHubStats {
  private constructor(
    private readonly totalStars: number,
    private readonly contributedRepos: number,
    private readonly commitsThisYear: number,
    private readonly contributionGraph: ContributionGraph,
  ) {}

  public static create(props: {
    totalStars: number;
    contributedRepos: number;
    commitsThisYear: number;
    contributionGraph: ContributionGraph;
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
        validationResult.value.contributionGraph,
      ),
    );
  }

  public static reconstitute(props: {
    totalStars: number;
    contributedRepos: number;
    commitsThisYear: number;
    contributionGraph: ContributionGraph;
  }): Result<GitHubStats, string> {
    return this.create(props);
  }

  private static validate(props: {
    totalStars: number;
    contributedRepos: number;
    commitsThisYear: number;
    contributionGraph: ContributionGraph;
  }): Result<
    {
      totalStars: number;
      contributedRepos: number;
      commitsThisYear: number;
      contributionGraph: ContributionGraph;
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
    if (!props.contributionGraph) {
      return Result.fail('Contribution graph is required');
    }

    return Result.ok({
      totalStars: props.totalStars,
      contributedRepos: props.contributedRepos,
      commitsThisYear: props.commitsThisYear,
      contributionGraph: props.contributionGraph,
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

  public getContributionGraph(): ContributionGraph {
    return this.contributionGraph;
  }

  public toPrimitive() {
    return {
      totalStars: this.totalStars,
      contributedRepos: this.contributedRepos,
      commitsThisYear: this.commitsThisYear,
      contributionGraph: this.contributionGraph,
    };
  }

  public updateStats(props: {
    totalStars?: number;
    contributedRepos?: number;
    commitsThisYear?: number;
    contributionGraph?: ContributionGraph;
  }): Result<GitHubStats, string> {
    return GitHubStats.create({
      totalStars: props.totalStars ?? this.totalStars,
      contributedRepos: props.contributedRepos ?? this.contributedRepos,
      commitsThisYear: props.commitsThisYear ?? this.commitsThisYear,
      contributionGraph: props.contributionGraph ?? this.contributionGraph,
    });
  }
}

export type ContributionLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

export type ContributionDay = {
  color: string;
  contributionCount: number;
  contributionLevel: ContributionLevel;
  date: string;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type ContributionGraph = {
  maxContributions?: number;
  totalContributions: number;
  weeks: ContributionWeek[];
};

export type GithubStats = {
  commitsThisYear: number;
  contributedRepos: number;
  contributionGraph: ContributionGraph;
  totalStars: number;
};

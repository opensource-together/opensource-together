export type PullRequestQueryParams = {
  provider?: "github" | "gitlab";
  page?: number;
  per_page?: number;
  state?: "open" | "closed" | "merged" | "all";
};

export type UserPullRequest = {
  title: string;
  repository: string;
  owner: string | null;
  state: "OPEN" | "CLOSED" | "MERGED" | "merged" | "closed" | "open";
  draft: boolean;
  number: number;
  created_at: string;
  updated_at: string | null;
  closed_at: string | null;
  merged_at: string | null;
  url: string;
  branch: {
    from: string;
    to: string;
  };
};

export type PullRequestPagination = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PullRequestProviderData = {
  data: UserPullRequest[];
  pagination: PullRequestPagination;
};

export type PullRequestsResponse = {
  github?: PullRequestProviderData | null;
  gitlab?: PullRequestProviderData | null;
};

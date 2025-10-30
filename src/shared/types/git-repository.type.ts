export type GitUserRepositoriesQueryParams = {
  provider?: "github" | "gitlab";
  page?: number;
  per_page?: number;
};

export type GitUserRepositoryType = {
  name: string;
  description: string | null;
  stargazers_count: number | undefined;
  forks_count: number | undefined;
  open_issues_count: number | undefined;
  url: string | null;
  logo_url: string | null;
  html_url: string;
  created_at: string | null | undefined;
  updated_at: string | null | undefined;
  pushed_at: string | null | undefined;
};

export type GitUserRepositoriesPagination = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type GitUserRepositoriesProviderData = {
  data: GitUserRepositoryType[];
  pagination: GitUserRepositoriesPagination;
};

export type GitUserRepositoriesResponse = {
  github?: GitUserRepositoriesProviderData | null;
  gitlab?: GitUserRepositoriesProviderData | null;
};

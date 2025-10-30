export type UserGitRepositoryQueryParams = {
  provider?: "github" | "gitlab";
  page?: number;
  per_page?: number;
};

export type UserGitRepository = {
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

export type UserGitRepositoryPagination = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type UserGitRepositoryProviderData = {
  data: UserGitRepository[];
  pagination: UserGitRepositoryPagination;
};

export type UserGitRepositoryResponse = {
  github?: UserGitRepositoryProviderData | null;
  gitlab?: UserGitRepositoryProviderData | null;
};

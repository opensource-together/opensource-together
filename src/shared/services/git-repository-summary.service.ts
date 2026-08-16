import { type ApiRequestContext, apiData } from "@/shared/lib/api-client";

export interface RepositoryDetailsResponse {
  forksCount: number;
  openIssuesCount: number;
  stars: number;
  languages: { [language: string]: number };
  created_at?: string | null;
  updated_at?: string | null;
  pushed_at?: string | null;
}

export function getProjectRepositorySummary(
  projectId: string,
  context: ApiRequestContext = {}
): Promise<RepositoryDetailsResponse> {
  return apiData<RepositoryDetailsResponse>(
    `/projects/${projectId}/repository-summary`,
    context
  );
}

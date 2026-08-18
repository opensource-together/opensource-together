import { type ApiRequestContext, apiData } from "@/shared/lib/api-client";

import type { Issue } from "../types/project.type";

export function getProjectIssue(
  projectId: string,
  issueNumber: number,
  context: ApiRequestContext = {}
): Promise<Issue> {
  return apiData<Issue>(
    `/projects/${projectId}/issues/${issueNumber}`,
    context
  );
}

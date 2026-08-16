import { useQuery } from "@tanstack/react-query";

import { getProjectIssue } from "../services/project-issue.service";
import type { Issue } from "../types/project.type";

export const useOpenIssueDetail = (
  projectId: string,
  issueNumber: number,
  enabled = true
) => {
  return useQuery<Issue>({
    queryKey: ["open-issue-detail", projectId, issueNumber],
    queryFn: ({ signal }) =>
      getProjectIssue(projectId, issueNumber, { signal }),
    enabled: !!projectId && !!issueNumber && enabled,
  });
};

import { useQuery } from "@tanstack/react-query";

import { getGitOpenIssueDetails } from "../services/git-open-issue-details.service";
import type { Issue } from "../types/project.type";

export const useOpenIssueDetail = (
  projectId: string,
  issueNumber: number,
  enabled = true
) => {
  return useQuery<Issue>({
    queryKey: ["open-issue-detail", projectId, issueNumber],
    queryFn: () => getGitOpenIssueDetails(projectId, issueNumber),
    enabled: !!projectId && !!issueNumber && enabled,
  });
};

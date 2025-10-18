import { VscGitPullRequest } from "react-icons/vsc";

import { EmptyState } from "@/shared/components/ui/empty-state";
import PullRequestCard from "@/shared/components/ui/pull-request-card";

import { PullRequest } from "../types/project.type";

interface ProjectPullRequestListProps {
  pullRequests: PullRequest[];
}
export default function ProjectPullRequestList({
  pullRequests,
}: ProjectPullRequestListProps) {
  if (pullRequests.length === 0)
    return (
      <EmptyState
        title="No PRs found"
        description="No pull requests found for this project"
        icon={VscGitPullRequest}
      />
    );
  return (
    <div className="flex flex-col gap-6">
      {pullRequests.map((pullRequest) => (
        <PullRequestCard key={pullRequest.url} pullRequest={pullRequest} />
      ))}
    </div>
  );
}

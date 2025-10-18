import PullRequestCard from "@/shared/components/ui/pull-request-card";

import { PullRequest } from "../types/project.type";

interface ProjectPullRequestListProps {
  pullRequests: PullRequest[];
}
export default function ProjectPullRequestList({
  pullRequests,
}: ProjectPullRequestListProps) {
  return (
    <div className="flex flex-col gap-6">
      {pullRequests.map((pullRequest) => (
        <PullRequestCard key={pullRequest.url} pullRequest={pullRequest} />
      ))}
    </div>
  );
}

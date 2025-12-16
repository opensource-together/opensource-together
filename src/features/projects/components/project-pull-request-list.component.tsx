import { useMemo, useState } from "react";
import { VscGitPullRequest } from "react-icons/vsc";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import PullRequestCard from "@/shared/components/ui/pull-request-card";

import type { PullRequest } from "../types/project.type";

interface ProjectPullRequestListProps {
  pullRequests: PullRequest[];
}
export default function ProjectPullRequestList({
  pullRequests,
}: ProjectPullRequestListProps) {
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const visiblePRs = useMemo(
    () => pullRequests.slice(0, Math.max(visibleCount, 0)),
    [pullRequests, visibleCount]
  );

  if (pullRequests.length === 0)
    return (
      <EmptyState
        title="No PRs found"
        description="No pull requests found for this project"
        icon={VscGitPullRequest}
      />
    );

  const canLoadMore = visibleCount < pullRequests.length;

  return (
    <section>
      <div className="flex flex-col gap-6">
        {visiblePRs.map((pullRequest) => (
          <PullRequestCard key={pullRequest.url} pullRequest={pullRequest} />
        ))}
      </div>
      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + 10)}
            aria-label="Load more pull requests"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { VscIssues } from "react-icons/vsc";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";

import IssueCard from "../../../../shared/components/ui/issue-card";
import { Issue } from "../../types/project.type";

interface OpenIssuesProps {
  issues: Issue[];
  projectId: string;
  className?: string;
}

export default function OpenIssuesList({
  issues,
  projectId,
  className,
}: OpenIssuesProps) {
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const visibleIssues = useMemo(
    () => issues.slice(0, Math.max(visibleCount, 0)),
    [issues, visibleCount]
  );

  if (issues.length === 0) {
    return (
      <EmptyState
        title="No issues"
        description="No open issues found for this project"
        icon={VscIssues}
      />
    );
  }

  const canLoadMore = visibleCount < issues.length;

  return (
    <section className={className}>
      <div className="flex flex-col gap-6">
        {visibleIssues.map((issue, idx) => (
          <IssueCard
            key={`${issue.url}-${idx}`}
            issue={issue}
            projectId={projectId}
          />
        ))}
      </div>
      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + 10)}
            aria-label="Load more issues"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}

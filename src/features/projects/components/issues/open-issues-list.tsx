"use client";

import { useEffect, useMemo, useState } from "react";
import { VscIssues } from "react-icons/vsc";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
  GOOD_FIRST_BADGE_LABEL,
  isGoodFirstIssue,
} from "@/shared/lib/utils/good-first-issue";

import IssueCard from "../../../../shared/components/ui/issue-card";
import { Issue } from "../../types/project.type";

interface OpenIssuesProps {
  issues: Issue[];
  projectId: string;
  className?: string;
}

type IssueFilter = "all" | "good-first";

export default function OpenIssuesList({
  issues,
  projectId,
  className,
}: OpenIssuesProps) {
  const goodFirstIssues = useMemo(
    () => issues.filter((issue) => isGoodFirstIssue(issue)),
    [issues]
  );

  const [filter, setFilter] = useState<IssueFilter>(() =>
    goodFirstIssues.length > 0 ? "good-first" : "all"
  );
  const [visibleCount, setVisibleCount] = useState<number>(10);

  useEffect(() => {
    setVisibleCount(10);
  }, [filter]);

  useEffect(() => {
    if (goodFirstIssues.length === 0 && filter === "good-first") {
      setFilter("all");
    }
  }, [filter, goodFirstIssues.length]);

  const filteredIssues = useMemo(() => {
    if (filter === "good-first") {
      return goodFirstIssues;
    }
    return issues;
  }, [filter, goodFirstIssues, issues]);

  const visibleIssues = useMemo(
    () => filteredIssues.slice(0, Math.max(visibleCount, 0)),
    [filteredIssues, visibleCount]
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

  const canLoadMore = visibleCount < filteredIssues.length;
  const goodFirstCount = goodFirstIssues.length;

  return (
    <section className={className}>
      {goodFirstCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="bg-ost-blue-three flex size-1.5 rounded-full"></span>
            <h2 className="text-muted-foreground text-sm">
              <span className="text-primary font-medium">{goodFirstCount}</span>{" "}
              Good first {goodFirstCount === 1 ? "issue" : "issues"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "secondary" : "outline"}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
            >
              All issues
            </Button>
            <Button
              variant={filter === "good-first" ? "secondary" : "outline"}
              onClick={() => setFilter("good-first")}
              disabled={goodFirstCount === 0}
              aria-pressed={filter === "good-first"}
            >
              {GOOD_FIRST_BADGE_LABEL}s
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {visibleIssues.map((issue, idx) => (
          <IssueCard
            key={`${issue.url}-${idx}`}
            issue={issue}
            projectId={projectId}
            highlightLabel={
              isGoodFirstIssue(issue) ? GOOD_FIRST_BADGE_LABEL : undefined
            }
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

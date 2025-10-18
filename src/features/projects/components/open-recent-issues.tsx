import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

import { Issue } from "@/features/projects/types/project.type";

import IssueCard from "../../../shared/components/ui/issue-card";

interface OpenRecentIssuesProps {
  issues: Issue[];
  projectId: string;
  className?: string;
}

export default function OpenRecentIssues({
  issues,
  projectId,
  className,
}: OpenRecentIssuesProps) {
  if (!issues || issues.length === 0) {
    return null;
  }
  return (
    <section className={className}>
      <div className="mt-14 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="bg-ost-blue-three flex size-1.5 rounded-full"></span>
          <h2 className="text-muted-foreground text-sm">
            <span className="text-primary font-medium">
              {issues.slice(0, 3).length}
            </span>{" "}
            {issues.slice(0, 3).length === 1 ? "Recent Issue" : "Recent Issues"}
          </h2>
        </div>
        <Link href="?tab=open-issues">
          <Button variant="outline">View Open Issues</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {issues.slice(0, 3).map((issue, idx) => (
          <IssueCard
            key={`${issue.url}-${idx}`}
            issue={issue}
            projectId={projectId}
          />
        ))}
      </div>
    </section>
  );
}

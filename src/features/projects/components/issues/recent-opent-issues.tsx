import Link from "next/link";
import type { Issue } from "@/features/projects/types/project.type";
import { Button } from "@/shared/components/ui/button";
import IssueCard from "@/shared/components/ui/issue-card";
import {
  GOOD_FIRST_BADGE_LABEL,
  isGoodFirstIssue,
} from "@/shared/lib/utils/good-first-issue";

interface RecentOpenIssuesProps {
  issues: Issue[];
  projectId: string;
  className?: string;
}

export default function RecentOpenIssues({
  issues,
  projectId,
  className,
}: RecentOpenIssuesProps) {
  if (!issues || issues.length === 0) {
    return null;
  }

  const recentIssues = issues.slice(0, 3);

  return (
    <section className={className}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex size-1.5 rounded-full bg-ost-blue-three"></span>
          <h2 className="text-muted-foreground text-sm">
            <span className="font-medium text-primary">
              {recentIssues.length}
            </span>{" "}
            {recentIssues.length === 1 ? "Recent Issue" : "Recent Issues"}
          </h2>
        </div>
        <Link href="?tab=open-issues">
          <Button variant="outline">View Open Issues</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {recentIssues.map((issue, idx) => (
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
    </section>
  );
}

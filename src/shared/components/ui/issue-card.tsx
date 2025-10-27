"use client";

import { GoIssueOpened } from "react-icons/go";
import { LuClock3 } from "react-icons/lu";

import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/lib/utils";
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

import IssueDetailSheet from "@/features/projects/components/issues/issue-detail-sheet.component";
import { Issue } from "@/features/projects/types/project.type";

import { BadgeWithIcon } from "./badge-with-icon";

interface IssueCardProps {
  issue: Issue;
  projectId: string;
  className?: string;
  highlightLabel?: string;
}

function extractNumberFromUrl(url: string): string | null {
  const match = url.match(/\/(\d+)(?:$|#|\?)/);
  return match?.[1] ?? null;
}

export default function IssueCard({
  issue,
  projectId,
  className,
  highlightLabel,
}: IssueCardProps) {
  const number = extractNumberFromUrl(issue.url);
  return (
    <IssueDetailSheet issue={issue} projectId={projectId}>
      <article
        className={cn(
          "border-muted-black-stroke rounded-[20px] border px-5 py-5 transition-all duration-200 hover:cursor-pointer hover:shadow-sm",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              {number && (
                <BadgeWithIcon
                  variant="info"
                  iconSize="size-3"
                  className="pl-1.5"
                  icon={GoIssueOpened}
                >
                  #{number}
                </BadgeWithIcon>
              )}
              <span className="line-clamp-1 text-sm font-medium tracking-tight">
                {issue.title}
              </span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={issue.author?.avatar_url}
                    name={issue.author?.login || ""}
                    size="xs"
                  />
                  <span className="truncate font-medium">
                    {issue.author?.login}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm tracking-tight">
                  <LuClock3 size={12} />
                  <span>
                    {formatTimeAgo(issue.updated_at || issue.created_at)}
                  </span>
                </div>
              </div>
              {issue.labels && issue.labels.length > 0 && (
                <div className="flex items-center gap-2">
                  {highlightLabel ? (
                    <Badge variant="indigo">{highlightLabel}</Badge>
                  ) : (
                    <Badge key={issue.labels[0]} variant="gray">
                      {issue.labels[0]}
                    </Badge>
                  )}
                  {issue.labels.length >= 2 && (
                    <span className="text-muted-foreground flex h-5.5 flex-shrink-0 items-center text-xs font-medium whitespace-nowrap">
                      +{issue.labels.length - 1}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </IssueDetailSheet>
  );
}

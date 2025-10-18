"use client";

import Link from "next/link";
import { LuClock3 } from "react-icons/lu";
import { VscGitPullRequest } from "react-icons/vsc";

import { cn } from "@/shared/lib/utils";
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

import { PullRequest } from "@/features/projects/types/project.type";

import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { BadgeWithIcon } from "./badge-with-icon";
import { Separator } from "./separator";

interface PullRequestCardProps {
  pullRequest: PullRequest;
  className?: string;
}

export default function PullRequestCard({
  pullRequest,
  className,
}: PullRequestCardProps) {
  return (
    <Link href={pullRequest.url} target="_blank" rel="noreferrer">
      <article
        className={cn(
          "rounded-[20px] border border-[black]/6 px-5 py-5 transition-all duration-200 hover:cursor-pointer hover:shadow-sm",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <BadgeWithIcon
                variant="info"
                className="pl-1.5"
                icon={VscGitPullRequest}
              >
                #{pullRequest.number}
              </BadgeWithIcon>
              <span className="line-clamp-1 text-sm font-medium tracking-tight">
                {pullRequest.title}
              </span>
            </div>
            <Separator className="my-4" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={pullRequest.author?.avatar_url}
                    name={pullRequest.author?.login || ""}
                    size="xs"
                  />
                  <span className="truncate font-medium">
                    {pullRequest.author?.login}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm tracking-tight">
                  <LuClock3 size={12} />
                  <span>
                    {formatTimeAgo(
                      pullRequest.updated_at || pullRequest.created_at
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pullRequest.draft && <Badge variant="gray">Draft</Badge>}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

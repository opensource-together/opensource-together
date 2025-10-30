import Link from "next/link";
import { FaGithub, FaGitlab } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";

import { BadgeWithIcon } from "@/shared/components/ui/badge-with-icon";
import { Separator } from "@/shared/components/ui/separator";
import { formatTimeAgo } from "@/shared/lib/utils/format-time-ago";

import { UserPullRequest } from "../types/profile.pull-request.type";

export default function PullRequestList({
  provider,
  list,
}: {
  provider: "github" | "gitlab";
  list: UserPullRequest[];
}) {
  if (!list || list.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4">
        {list.map((pr, idx) => (
          <PullRequestCard
            key={`${pr.url}-${idx}`}
            pr={pr}
            provider={provider}
          />
        ))}
      </div>
    </div>
  );
}

export function PullRequestCard({
  pr,
  provider,
}: {
  pr: UserPullRequest;
  provider: "github" | "gitlab";
}) {
  const normalizedState = pr.state?.toLowerCase();
  const isMerged = normalizedState === "merged" || !!pr.merged_at;
  const isClosed = normalizedState === "closed" && !isMerged;
  const isOpen = normalizedState === "open";
  const isDraft = normalizedState === "draft";

  const repoPath =
    pr.repository.includes("/") && pr.repository
      ? pr.repository
      : pr.owner
        ? `${pr.owner}/${pr.repository}`
        : pr.repository;

  return (
    <Link href={pr.url} target="_blank" rel="noreferrer">
      <article className="border-muted-black-stroke rounded-[20px] border px-5 py-5 transition-all duration-200 hover:cursor-pointer hover:shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              {isMerged && (
                <BadgeWithIcon variant="info" iconSize="size-4">
                  Merged
                </BadgeWithIcon>
              )}
              {isClosed && (
                <BadgeWithIcon variant="danger" iconSize="size-4">
                  Closed
                </BadgeWithIcon>
              )}
              {isOpen && (
                <BadgeWithIcon variant="success" iconSize="size-4">
                  Open
                </BadgeWithIcon>
              )}
              {isDraft && (
                <BadgeWithIcon variant="default" iconSize="size-4">
                  Draft
                </BadgeWithIcon>
              )}
              <span className="line-clamp-1 text-sm font-medium tracking-tight">
                {pr.title}
              </span>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                {provider === "github" ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <FaGithub size={20} />
                    GitHub
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <FaGitlab size={16} />
                    Gitlab
                  </span>
                )}
                <div className="flex items-center gap-1 text-sm tracking-tight">
                  <LuClock3 size={12} />
                  <span>{formatTimeAgo(pr.updated_at || pr.created_at)}</span>
                </div>
              </div>
              <span className="text-muted-foreground truncate text-xs">
                {repoPath}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

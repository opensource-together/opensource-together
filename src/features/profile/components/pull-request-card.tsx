import Link from "next/link";
import { FaGithub, FaGitlab } from "react-icons/fa6";

import { Badge } from "@/shared/components/ui/badge";

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

  const createdAt = new Date(pr.created_at);

  const repoPath =
    pr.repository.includes("/") && pr.repository
      ? pr.repository
      : pr.owner
        ? `${pr.owner}/${pr.repository}`
        : pr.repository;

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-2">
            {provider === "github" ? (
              <FaGithub size={16} />
            ) : (
              <FaGitlab size={16} />
            )}
            <Link
              href={pr.url}
              target="_blank"
              className="truncate text-base font-medium hover:underline"
            >
              {pr.title}
            </Link>
            <div className="flex items-center gap-1">
              {isMerged && <Badge variant="info">Merged</Badge>}
              {isClosed && <Badge variant="destructive">Closed</Badge>}
              {isOpen && <Badge variant="success">Open</Badge>}
            </div>
          </div>
          <div className="text-muted-foreground truncate text-sm">
            {repoPath}
          </div>
          <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
            <span className="rounded-md bg-neutral-100 px-2 py-1 font-mono">
              {pr.branch.from}
            </span>
            <span>→</span>
            <span className="rounded-md bg-neutral-100 px-2 py-1 font-mono">
              {pr.branch.to}
            </span>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-col items-end gap-1 text-xs">
          <div>Created {createdAt.toLocaleDateString()}</div>
          {isMerged && pr.merged_at && (
            <div>Merged {new Date(pr.merged_at).toLocaleDateString()}</div>
          )}
          {isClosed && pr.closed_at && (
            <div>Closed {new Date(pr.closed_at).toLocaleDateString()}</div>
          )}
        </div>
      </div>
    </div>
  );
}

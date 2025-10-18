"use client";

import { Avatar } from "@/shared/components/ui/avatar";

export type ContributorLike = {
  login?: string;
  avatar_url?: string;
};

interface ContributorsSidebarListProps {
  title?: string;
  contributors: ContributorLike[];
  maxVisible?: number;
  onClickContributor?: (c: ContributorLike) => void;
  emptyText?: string;
  totalCount?: number;
}

export function ContributorsSidebarList({
  title,
  contributors,
  maxVisible = 6,
  onClickContributor,
  emptyText,
  totalCount,
}: ContributorsSidebarListProps) {
  const visible = contributors.slice(0, maxVisible);
  const total =
    typeof totalCount === "number" ? totalCount : contributors.length;
  const remaining = Math.max(total - 3, 0);
  const remainingDisplay = total >= 100 || remaining > 99 ? "99+" : remaining;
  return (
    <div>
      {title && <h2 className="mb-3 text-sm">{title}</h2>}
      <div className="ml-4 flex gap-2">
        {visible.map((contributor, index) => (
          <div
            key={contributor.login || index}
            className="flex items-center gap-2"
            title={contributor.login}
          >
            <Avatar
              src={contributor.avatar_url}
              name={contributor.login}
              alt={contributor.login}
              size="sm"
              className="-ml-4 cursor-pointer shadow-xs outline-2 outline-white transition-transform duration-150 hover:-translate-y-0.5"
              onClick={() => onClickContributor?.(contributor)}
            />
          </div>
        ))}
      </div>
      {contributors.length === 0 && (
        <p className="text-muted-foreground text-sm">{emptyText}</p>
      )}
      <div className="text-muted-foreground mt-3 text-xs">
        {visible
          .slice(0, 3)
          .map((contributor) => contributor.login)
          .join(", ")}
        {total > 3 && <> &amp; {remainingDisplay} more</>}
      </div>
    </div>
  );
}

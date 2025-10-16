"use client";

import { Avatar } from "@/shared/components/ui/avatar";

export type ContributorLike = {
  login?: string;
  avatar_url?: string;
};

interface ContributorsListProps {
  title?: string;
  contributors: ContributorLike[];
  maxVisible?: number;
  onClickContributor?: (c: ContributorLike) => void;
  emptyText?: string;
}

export function ContributorsList({
  title,
  contributors,
  maxVisible = 6,
  onClickContributor,
  emptyText,
}: ContributorsListProps) {
  const visible = contributors.slice(0, maxVisible);
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
        {contributors.length > 3 && <> &amp; {contributors.length - 3} more</>}
      </div>
    </div>
  );
}

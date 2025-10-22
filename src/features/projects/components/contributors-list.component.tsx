import Link from "next/link";
import { useMemo, useState } from "react";
import { HiUserGroup } from "react-icons/hi";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";

import { Contributor } from "../types/project.type";

interface ContributorsListProps {
  contributors: Contributor[];
  className?: string;
}

export default function ContributorsList({
  contributors,
  className,
}: ContributorsListProps) {
  const [visibleCount, setVisibleCount] = useState<number>(30);
  const visibleContributors = useMemo(
    () => contributors.slice(0, Math.max(visibleCount, 0)),
    [contributors, visibleCount]
  );

  if (contributors.length === 0) {
    return (
      <EmptyState
        title="No contributors"
        description="No contributors found for this project"
        icon={HiUserGroup}
      />
    );
  }

  const canLoadMore = visibleCount < contributors.length;

  return (
    <section className={className}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visibleContributors.map((contributor, idx) => (
          <ContributorCard
            key={`${contributor.login}-${idx}`}
            contributor={contributor}
          />
        ))}
      </div>
      {canLoadMore && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((c) => c + 30)}
            aria-label="Load more issues"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}

function ContributorCard({ contributor }: { contributor: Contributor }) {
  const contributorUrl = `https://github.com/${contributor.login}`;

  return (
    <Link href={contributorUrl} target="_blank" rel="noreferrer">
      <div className="border-muted-black-stroke flex items-center gap-4 rounded-[20px] border px-4 py-3.5 transition-all duration-200 hover:cursor-pointer hover:shadow-sm">
        <Avatar
          src={contributor.avatar_url}
          name={contributor.login}
          alt={contributor.login}
          size="md"
        />
        <div className="flex flex-col gap-0.5 truncate text-nowrap">
          <p className="text-sm font-medium">{contributor.login}</p>
          <p className="text-muted-foreground text-sm">
            {contributor.contributions}{" "}
            {contributor.contributions === 1 ? "Contribution" : "Contributions"}
          </p>
        </div>
      </div>
    </Link>
  );
}

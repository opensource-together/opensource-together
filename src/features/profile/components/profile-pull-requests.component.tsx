"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/shared/components/ui/pagination";

import { useUserPullRequests } from "../hooks/use-profile.hook";
import { PullRequestQueryParams, UserPullRequest } from "../types/profile.type";
import PullRequestCard from "./pull-request-card";

type ProfileContributionsProps = {
  enabled: boolean;
};

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function ProfileContributions({
  enabled,
}: ProfileContributionsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const provider =
    (searchParams.get("provider") as PullRequestQueryParams["provider"]) ||
    undefined;
  const state =
    (searchParams.get("state") as PullRequestQueryParams["state"]) || undefined;
  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 10);

  const { data, isLoading, isError, isFetching } = useUserPullRequests({
    provider,
    state,
    page,
    per_page: perPage,
  });

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    // Reset pagination on filter changes
    if (key !== "page") params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePrev = () => updateParam("page", String(Math.max(1, page - 1)));
  const handleNext = () => updateParam("page", String(page + 1));

  const hasPrevPage = page > 1;
  const totalCount =
    (provider
      ? provider === "github"
        ? data?.github?.length
        : data?.gitlab?.length
      : (data?.github?.length ?? 0) + (data?.gitlab?.length ?? 0)) ?? 0;
  const hasNextPage = page * perPage < totalCount;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Pull Requests</h2>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border px-3 text-sm"
            value={provider ?? "all"}
            onChange={(e) =>
              updateParam(
                "provider",
                e.target.value === "all" ? null : e.target.value
              )
            }
          >
            <option value="all">All Providers</option>
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
          </select>
          <select
            className="h-9 rounded-md border px-3 text-sm"
            value={state ?? "all"}
            onChange={(e) =>
              updateParam(
                "state",
                e.target.value === "all" ? null : e.target.value
              )
            }
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="merged">Merged</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {!enabled ? (
        <div className="text-muted-foreground rounded-lg border p-6 text-sm">
          Open the Contributions tab to load data.
        </div>
      ) : isLoading || isFetching ? (
        <div className="text-muted-foreground rounded-lg border p-6 text-sm">
          Loading contributions...
        </div>
      ) : isError ? (
        <div className="text-destructive rounded-lg border p-6 text-sm">
          Failed to load contributions.
        </div>
      ) : totalCount === 0 ? (
        <div className="text-muted-foreground rounded-lg border p-6 text-sm">
          No contributions found.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {!provider ? (
            <>
              <PRSection provider="github" list={data?.github ?? []} />
              <PRSection provider="gitlab" list={data?.gitlab ?? []} />
            </>
          ) : (
            <PRSection
              provider={provider}
              list={
                provider === "github"
                  ? (data?.github ?? [])
                  : (data?.gitlab ?? [])
              }
            />
          )}
          <Pagination className="mt-2">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handlePrev}
                  disabled={!hasPrevPage}
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="default"
                  onClick={handleNext}
                  disabled={!hasNextPage}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function PRSection({
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

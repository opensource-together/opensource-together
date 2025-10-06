"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/shared/components/ui/pagination";

import { useUserPullRequests } from "../hooks/use-profile.hook";
import { PullRequestQueryParams } from "../types/profile.type";

type ProfileContributionsProps = {
  enabled: boolean;
};

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const getProviderIcon = (provider: string | undefined) => {
  if (provider === "gitlab") return "gitlab" as const;
  return "github" as const;
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
  const sort = (searchParams.get("sort") as "recent" | "oldest") || "recent";
  const page = parseNumber(searchParams.get("page"), 1);
  const perPage = parseNumber(searchParams.get("per_page"), 10);

  const { data, isLoading, isError, refetch, isFetching } = useUserPullRequests(
    {
      provider,
      state,
      page,
      per_page: perPage,
      enabled,
      staleTime: 30_000,
    }
  );

  const { visibleList, totalCount } = useMemo(() => {
    const github = data?.data.github ?? [];
    const gitlab = data?.data.gitlab ?? [];

    const withProviderGithub = github.map((pr) => ({
      ...pr,
      _provider: "github" as const,
    }));
    const withProviderGitlab = gitlab.map((pr) => ({
      ...pr,
      _provider: "gitlab" as const,
    }));

    const combined =
      provider === "github"
        ? withProviderGithub
        : provider === "gitlab"
          ? withProviderGitlab
          : [...withProviderGithub, ...withProviderGitlab];

    const sorted = [...combined].sort((a, b) => {
      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return sort === "recent" ? bDate - aDate : aDate - bDate;
    });

    const start = (page - 1) * perPage;
    const end = page * perPage;
    return { visibleList: sorted.slice(start, end), totalCount: sorted.length };
  }, [data, provider, sort, page, perPage]);

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
  const hasNextPage = page * perPage < totalCount;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-xl font-semibold">Pull Requests</h2>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border bg-white px-3 text-sm"
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
          <select
            className="h-9 rounded-md border bg-white px-3 text-sm"
            value={provider ?? "all"}
            onChange={(e) =>
              updateParam(
                "provider",
                e.target.value === "all" ? null : e.target.value
              )
            }
          >
            <option value="all">All</option>
            <option value="github">GitHub</option>
            <option value="gitlab">GitLab</option>
          </select>
          <select
            className="h-9 rounded-md border bg-white px-3 text-sm"
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
            <option value="closed">Closed</option>
            <option value="merged">Merged</option>
          </select>
        </div>
      </div>

      {!enabled ? (
        <div className="text-muted-foreground rounded-lg border bg-white p-6 text-sm">
          Ouvrez l’onglet Contributions pour charger les données.
        </div>
      ) : isLoading || isFetching ? (
        <div className="text-muted-foreground rounded-lg border bg-white p-6 text-sm">
          Chargement des contributions...
        </div>
      ) : isError ? (
        <div className="text-destructive rounded-lg border bg-white p-6 text-sm">
          Échec du chargement des contributions.
        </div>
      ) : visibleList.length === 0 ? (
        <div className="text-muted-foreground rounded-lg border bg-white p-6 text-sm">
          Aucune contribution trouvée.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleList.map((pr, idx) => {
            const isMerged =
              typeof (pr as any).merged_at === "string" &&
              (pr as any).merged_at.length > 0;
            const stateLower = (pr.state || "").toLowerCase();
            const isClosed = !isMerged && stateLower === "closed";
            const isOpen = stateLower === "open";
            const createdAt = new Date(pr.created_at);
            const updatedAt = new Date(pr.updated_at);
            return (
              <div
                key={`${pr.url}-${idx}`}
                className="rounded-lg border bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Icon
                        name={getProviderIcon((pr as any)._provider)}
                        size="sm"
                      />
                      <Link
                        href={pr.url}
                        target="_blank"
                        className="truncate text-base font-semibold hover:underline"
                      >
                        {pr.title}
                      </Link>
                      <div className="flex items-center gap-1">
                        {isMerged && <Badge variant="secondary">Merged</Badge>}
                        {isClosed && (
                          <Badge variant="destructive">Closed</Badge>
                        )}
                        {isOpen && <Badge variant="success">Open</Badge>}
                      </div>
                    </div>
                    <div className="text-muted-foreground truncate text-sm">
                      {(typeof (pr as any).owner === "string" &&
                      (pr as any).owner
                        ? `${(pr as any).owner}/`
                        : "") + pr.repository}
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
                    <div>Updated {updatedAt.toLocaleDateString()}</div>
                    <Link
                      href={pr.url}
                      target="_blank"
                      className="text-primary text-sm hover:underline"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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

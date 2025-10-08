"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GoGitPullRequest } from "react-icons/go";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/shared/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useUserPullRequests } from "../hooks/use-profile.hook";
import { PullRequestQueryParams } from "../types/profile.type";
import PullRequestList from "./pull-request-card";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export default function ProfilePullRequests() {
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
    if (key !== "page") params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePrev = () => updateParam("page", String(Math.max(1, page - 1)));
  const handleNext = () => updateParam("page", String(page + 1));

  const hasPrevPage = page > 1;
  const getHasNextPage = (p: "github" | "gitlab") =>
    p === "github"
      ? (data?.github?.pagination?.hasNextPage ?? false)
      : (data?.gitlab?.pagination?.hasNextPage ?? false);

  const hasNextPage = provider
    ? getHasNextPage(provider)
    : getHasNextPage("github") || getHasNextPage("gitlab");

  if (
    data === null ||
    data?.github?.data.length === 0 ||
    data?.gitlab?.data.length === 0
  )
    return (
      <EmptyState icon={GoGitPullRequest} text="No pull requests found." />
    );
  if (isLoading || isFetching) return <div>Loading pull requests...</div>;
  if (isError)
    return (
      <ErrorState
        message="An error has occurred while loading the pull requests. Please try again later."
        queryKey={["user", "me", "pullrequests"]}
      />
    );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Pull Requests</h2>
        <div className="flex items-center gap-2">
          <Select
            value={provider ?? "all"}
            onValueChange={(value) =>
              updateParam("provider", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="gitlab">GitLab</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={state ?? "all"}
            onValueChange={(value) =>
              updateParam("state", value === "all" ? null : value)
            }
          >
            <SelectTrigger className="h-9 w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="merged">Merged</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {!provider ? (
          <>
            <PullRequestList
              provider="github"
              list={data?.github?.data ?? []}
            />
            <PullRequestList
              provider="gitlab"
              list={data?.gitlab?.data ?? []}
            />
          </>
        ) : (
          <PullRequestList
            provider={provider}
            list={
              provider === "github"
                ? (data?.github?.data ?? [])
                : (data?.gitlab?.data ?? [])
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
                disabled={!hasPrevPage || isFetching}
              >
                <HiChevronLeft className="size-4" /> Previous
              </Button>
            </PaginationItem>

            <span className="px-2 text-sm opacity-80"> {page}</span>

            <PaginationItem>
              <Button
                variant="ghost"
                size="default"
                onClick={handleNext}
                disabled={!hasNextPage || isFetching}
              >
                Next <HiChevronRight className="size-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

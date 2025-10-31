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

import ProfilePullRequestList from "../components/profile-pull-request-card";
import { ProfilePullRequestsSkeleton } from "../components/skeletons/profile-pull-requests-skeleton.component";
import {
  useUserMyPullRequests,
  useUserPullRequestsById,
} from "../hooks/use-profile-pull-request.hook";
import { PullRequestQueryParams } from "../types/profile.pull-request.type";

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

interface ProfilePullRequestsProps {
  userId?: string;
}

export default function ProfilePullRequests({
  userId,
}: ProfilePullRequestsProps) {
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

  const queryParams = {
    provider,
    state,
    page,
    per_page: perPage,
  };

  const myPullRequestsResult = useUserMyPullRequests(queryParams);
  const userPullRequestsResult = useUserPullRequestsById(
    userId || "",
    queryParams
  );

  const { data, isLoading, isError, isFetching } = userId
    ? userPullRequestsResult
    : myPullRequestsResult;

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

  const renderFilters = () => (
    <div className="flex items-center justify-between">
      <h2 className="hidden font-medium md:block">Pull Requests</h2>
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
  );

  if (isLoading)
    return (
      <div className="flex w-full flex-col gap-4">
        {renderFilters()}
        <ProfilePullRequestsSkeleton />
      </div>
    );

  if (isError)
    return (
      <div className="flex w-full flex-col gap-4">
        {renderFilters()}
        <ErrorState
          message="An error has occurred while loading the pull requests. Please try again later."
          queryKey={
            userId
              ? ["user", userId, "pullrequests"]
              : ["user", "me", "pullrequests"]
          }
        />
      </div>
    );

  // Check if there's no data available
  const githubData = data?.github?.data;
  const gitlabData = data?.gitlab?.data;
  const githubHasData =
    githubData && Array.isArray(githubData) && githubData.length > 0;
  const gitlabHasData =
    gitlabData && Array.isArray(gitlabData) && gitlabData.length > 0;

  const hasNoData =
    !data ||
    (provider === "github" && !githubHasData) ||
    (provider === "gitlab" && !gitlabHasData) ||
    (!provider && !githubHasData && !gitlabHasData);

  if (hasNoData)
    return (
      <div className="flex w-full flex-col gap-4">
        {renderFilters()}
        <EmptyState
          icon={GoGitPullRequest}
          title="No PRs found"
          description="No pull requests have been made yet."
        />
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-4">
      {renderFilters()}
      <div className="flex flex-col gap-4">
        {!provider ? (
          <>
            <ProfilePullRequestList
              provider="github"
              list={data?.github?.data ?? []}
            />
            <ProfilePullRequestList
              provider="gitlab"
              list={data?.gitlab?.data ?? []}
            />
          </>
        ) : (
          <ProfilePullRequestList
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
                size="sm"
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
                size="sm"
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

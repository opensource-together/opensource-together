"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLinkSocialAccountMutation } from "@/features/auth/hooks/auth.mutations";
import { Button } from "@/shared/components/ui/button";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useInfiniteGitUserRepositories } from "@/shared/hooks/use-git-user-repo.hook";
import { getErrorMessage } from "@/shared/lib/get-error-message";
import { extractRepositoryPath } from "@/shared/lib/utils/extract-repo-owner";
import type { GitUserRepositoryType } from "@/shared/types/git-repository.type";

import CustomScrollbar from "../../../components/stepper/custom-scrollbar.component";
import FormNavigationButtons from "../../../components/stepper/stepper-navigation-buttons.component";
import {
  type provider,
  useProjectCreateStore,
} from "../../../stores/project-create.store";

interface StepGitImportFormProps {
  provider: provider;
}

const PROVIDER_ACCESS = {
  github: {
    hint: "Don't see an organization repository?",
    url: "https://github.com/settings/applications",
  },
  gitlab: {
    hint: "Don't see a group project?",
    url: "https://gitlab.com/-/user_settings/applications",
  },
} as const;

export default function StepGitImportForm({
  provider,
}: StepGitImportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(320);
  const [selectedRepo, setSelectedRepo] =
    useState<GitUserRepositoryType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { selectRepository } = useProjectCreateStore();
  const linkAccountMutation = useLinkSocialAccountMutation();
  const access = PROVIDER_ACCESS[provider];

  const {
    data: gitReposPages,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteGitUserRepositories({ provider });

  const itemHeight = 64;
  const repos = (gitReposPages?.pages || [])
    .flatMap((p) => p?.[provider]?.data || [])
    .sort((a, b) => {
      if (!a.updated_at || !b.updated_at) return 0;
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
  const totalCount = repos.length;
  const totalHeight = itemHeight * totalCount;
  const visibleHeight = containerHeight;
  const hasOverflow = totalHeight > visibleHeight;

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const update = () => setContainerHeight(el.clientHeight || 320);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const handlePrevious = () => router.push("/projects/create");

  const handleSubmit = async () => {
    if (selectedRepo) {
      setIsSubmitting(true);
      selectRepository(selectedRepo);
      router.push(`/projects/create/${provider}/confirm`);
    }
  };

  if (isError) {
    const handleLinkAccount = async () => {
      try {
        await linkAccountMutation.mutateAsync({
          provider,
          callbackURL: `${window.location.origin}${pathname}`,
        });
      } catch (error) {
        toast.error(
          getErrorMessage(error, `Unable to link your ${provider} account`)
        );
      }
    };

    return (
      <ErrorState
        title="Error loading repositories"
        message={`We couldn't load your ${provider} repositories. Please link your ${provider} account to continue.`}
        onRetry={handleLinkAccount}
        isLoading={linkAccountMutation.isPending}
        retryText={
          linkAccountMutation.isPending
            ? `Linking ${provider}...`
            : `Link ${provider} account`
        }
      />
    );
  }

  return (
    <div className="w-full">
      <div className="relative flex w-full">
        <div
          ref={scrollRef}
          className={`mb-4 h-[350px] w-full rounded-md border border-black/4 ${
            hasOverflow ? "overflow-y-auto" : "overflow-hidden"
          }`}
          onScroll={(e) => {
            if (!hasOverflow) return;
            const el = e.target as HTMLDivElement;
            const nextTop = el.scrollTop;
            setScrollTop(nextTop);
            const threshold = 200; // px before bottom
            const reachedBottom =
              el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
            if (reachedBottom && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col divide-y divide-black/4">
            {isLoading ? (
              <RepositorySkeleton />
            ) : (
              repos?.map((repo: GitUserRepositoryType) => {
                const selected = selectedRepo?.html_url === repo.html_url;
                const path = extractRepositoryPath(repo.html_url) ?? repo.name;

                return (
                  <div
                    key={repo.html_url}
                    className={`flex h-[64px] items-center justify-between gap-4 px-6 transition-colors ${
                      selected ? "bg-black-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-black text-sm">
                        {path}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <span className="text-muted-foreground text-xs">
                        {repo.updated_at
                          ? new Date(repo.updated_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <Button
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedRepo(repo)}
                      >
                        {selected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
            {isFetchingNextPage && <RepositorySkeleton />}
          </div>
        </div>
        <CustomScrollbar
          height={containerHeight}
          contentHeight={totalHeight}
          scrollTop={scrollTop}
          onScrollTopChange={(value) => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = value;
            }
            setScrollTop(value);
          }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">{access.hint}</p>
        <Link
          href={access.url}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground text-sm underline-offset-4 hover:text-foreground hover:underline"
        >
          Manage access
        </Link>
      </div>

      <div className="mt-4">
        <FormNavigationButtons
          onNext={handleSubmit}
          onPrevious={handlePrevious}
          nextLabel="Next"
          isLoading={isSubmitting}
          nextType="button"
          isNextDisabled={!selectedRepo}
        />
      </div>
    </div>
  );
}

export function RepositorySkeleton() {
  const bar =
    "rounded-md animate-[skeleton-zinc-pulse_2s_ease-in-out_infinite]";
  return Array.from({ length: 10 }).map((_, idx) => (
    <div
      key={`skeleton-${idx}`}
      className="flex h-[64px] items-center justify-between px-6"
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className={`h-4 w-48 ${bar}`} />
        <div className={`h-3 w-32 ${bar}`} />
      </div>
      <div className={`h-8 w-24 ${bar}`} />
    </div>
  ));
}

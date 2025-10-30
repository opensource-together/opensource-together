"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useGitUserRepositories } from "@/shared/hooks/use-git-user-repo.hook";
import { GitUserRepositoryType } from "@/shared/types/git-repository.type";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import CustomScrollbar from "../../../components/stepper/custom-scrollbar.component";
import FormNavigationButtons from "../../../components/stepper/stepper-navigation-buttons.component";
import {
  provider,
  useProjectCreateStore,
} from "../../../stores/project-create.store";

interface StepGitImportFormProps {
  provider: provider;
}

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
  const { linkSocialAccount, isLinkingSocialAccount } = useAuth();

  const {
    data: gitRepos,
    isLoading,
    isError,
  } = useGitUserRepositories({ provider });

  const itemHeight = 64;
  const repos = (gitRepos?.[provider]?.data || []).sort((a, b) => {
    if (!a.updated_at || !b.updated_at) return 0;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
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

  const handleRepositorySelect = (repo: GitUserRepositoryType) => {
    setSelectedRepo(repo);
  };

  const handlePrevious = () => router.push("/projects/create");

  const handleSubmit = async () => {
    if (selectedRepo) {
      setIsSubmitting(true);
      selectRepository(selectedRepo);
      router.push(`/projects/create/${provider}/confirm`);
    }
  };

  if (isError) {
    const handleLinkAccount = () => {
      linkSocialAccount({
        provider,
        callbackURL: `${window.location.origin}${pathname}`,
      });
    };

    return (
      <ErrorState
        title="Error loading repositories"
        message={`We couldn't load your ${provider} repositories. Please link your ${provider} account to continue.`}
        onRetry={handleLinkAccount}
        retryText={
          isLinkingSocialAccount
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
          onScroll={(e) =>
            hasOverflow && setScrollTop((e.target as HTMLDivElement).scrollTop)
          }
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col divide-y divide-black/4">
            {isLoading ? (
              <RepositorySkeleton />
            ) : (
              repos?.map((repo: GitUserRepositoryType, idx: number) => (
                <div
                  key={idx}
                  className={`flex h-[64px] items-center justify-between px-6 transition-colors ${
                    selectedRepo?.name === repo.name
                      ? "bg-black-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-black">
                      {repo.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-xs">
                      {repo.updated_at
                        ? new Date(repo.updated_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <Button
                      type="button"
                      variant={
                        selectedRepo?.name === repo.name ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleRepositorySelect(repo)}
                    >
                      {selectedRepo?.name === repo.name ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))
            )}
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
  return Array.from({ length: 10 }).map((_, idx) => (
    <div
      key={`skeleton-${idx}`}
      className="flex h-[64px] animate-pulse items-center justify-between px-6"
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-48 rounded-md bg-gray-200"></div>
        <div className="h-3 w-32 rounded-md bg-gray-200"></div>
      </div>
      <div className="h-8 w-24 rounded-md bg-gray-200"></div>
    </div>
  ));
}

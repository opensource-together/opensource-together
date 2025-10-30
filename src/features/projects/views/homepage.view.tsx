"use client";

import { useEffect, useState } from "react";
import { HiMiniSquare2Stack } from "react-icons/hi2";
import { useInView } from "react-intersection-observer";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";

import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero.component";

import ProjectGrid from "../components/project-grid.component";
import SkeletonProjectGrid from "../components/skeletons/skeleton-project-grid.component";
import { useInfiniteProjects } from "../hooks/use-projects.hook";

interface HomepageLayoutProps {
  children: React.ReactNode;
  onFilterChange?: (filters: {
    techStacks: string[];
    categories: string[];
    orderBy: "createdAt" | "title";
    orderDirection: "asc" | "desc";
  }) => void;
  isLoading?: boolean;
}

function HomepageLayout({
  children,
  onFilterChange,
  isLoading,
}: HomepageLayoutProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <ProjectDiscoveryHero
          onFilterChange={onFilterChange}
          isLoading={isLoading}
        />
      </div>
      <div className="mx-6 max-w-6xl pb-4 md:pb-8 lg:mx-auto">{children}</div>
    </>
  );
}

export default function HomepageView() {
  const [filters, setFilters] = useState<{
    techStacks: string[];
    categories: string[];
    orderBy: "createdAt" | "title";
    orderDirection: "asc" | "desc";
  }>({
    techStacks: [],
    categories: [],
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  // Infinite scroll
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProjects(filters);

  // Merge all pages of projects
  const projects = data?.pages.flatMap((page) => page.data) || [];

  // Load next page on scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <HomepageLayout onFilterChange={setFilters} isLoading={isLoading}>
        <SkeletonProjectGrid />
      </HomepageLayout>
    );
  }

  if (isError) {
    return (
      <HomepageLayout onFilterChange={setFilters} isLoading={false}>
        <ErrorState
          message="An error has occurred while loading the projects. Please try again later."
          queryKey={["projects-infinite", filters]}
        />
      </HomepageLayout>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <HomepageLayout onFilterChange={setFilters} isLoading={false}>
        <EmptyState
          title="No projects"
          description="No projects founded here"
          icon={HiMiniSquare2Stack}
          className="mb-28"
        />
      </HomepageLayout>
    );
  }

  return (
    <HomepageLayout onFilterChange={setFilters} isLoading={isLoading}>
      <ProjectGrid projects={projects} />
      {hasNextPage && (
        <div ref={ref}>
          {isFetchingNextPage ? (
            <div className="my-4 sm:my-5 md:my-6">
              <SkeletonProjectGrid />
            </div>
          ) : (
            <div className="my-12 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                aria-label="Load more projects"
              >
                Load more projects
              </Button>
            </div>
          )}
        </div>
      )}
    </HomepageLayout>
  );
}

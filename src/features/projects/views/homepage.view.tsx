"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { HiMiniSquare2Stack } from "react-icons/hi2";
import { useInView } from "react-intersection-observer";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { ErrorState } from "@/shared/components/ui/error-state";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import ProjectDiscoveryHero from "@/features/projects/components/project-discovery-hero.component";

import { BlurredSigninCtaGrid } from "../components/blurred-signin-cta-grid.component";
import ProjectGrid from "../components/project-grid.component";
import SkeletonProjectGrid from "../components/skeletons/skeleton-project-grid.component";
import { useInfiniteProjects } from "../hooks/use-projects.hook";
import { ProjectFilters } from "../types/project-filters.type";

interface HomepageLayoutProps {
  children: React.ReactNode;
  onFilterChange?: (filters: ProjectFilters) => void;
  isLoading?: boolean;
  initialFilters?: ProjectFilters;
}

function HomepageLayout({
  children,
  onFilterChange,
  isLoading,
  initialFilters,
}: HomepageLayoutProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <ProjectDiscoveryHero
          onFilterChange={onFilterChange}
          isLoading={isLoading}
          initialFilters={initialFilters}
        />
      </div>
      <div className="mx-6 mb-20 max-w-6xl md:mb-36 lg:mx-auto">{children}</div>
    </>
  );
}

/**
 * Converts URL search params to ProjectFilters
 */
function parseFiltersFromURL(searchParams: URLSearchParams): ProjectFilters {
  const techStacksParam = searchParams.get("techStacks");
  const categoriesParam = searchParams.get("categories");
  const orderByParam = searchParams.get("orderBy");
  const orderDirectionParam = searchParams.get("orderDirection");

  // Validate orderBy
  const validOrderBy: ProjectFilters["orderBy"] =
    orderByParam === "createdAt" ||
    orderByParam === "title" ||
    orderByParam === "trending"
      ? orderByParam
      : "trending";

  const validOrderDirection: ProjectFilters["orderDirection"] =
    orderDirectionParam === "asc" || orderDirectionParam === "desc"
      ? orderDirectionParam
      : "desc";

  return {
    techStacks: techStacksParam
      ? techStacksParam.split(",").filter(Boolean)
      : [],
    categories: categoriesParam
      ? categoriesParam.split(",").filter(Boolean)
      : [],
    orderBy: validOrderBy,
    orderDirection: validOrderDirection,
  };
}

/**
 * Converts ProjectFilters to URL search params
 */
function filtersToURLParams(filters: ProjectFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.techStacks.length > 0) {
    params.set("techStacks", filters.techStacks.join(","));
  }

  if (filters.categories.length > 0) {
    params.set("categories", filters.categories.join(","));
  }

  if (filters.orderBy !== "trending") {
    params.set("orderBy", filters.orderBy);
  }

  if (filters.orderDirection !== "desc") {
    params.set("orderDirection", filters.orderDirection);
  }

  return params;
}

export default function HomepageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const MAX_FREE_PROJECTS = 50;

  const filters = useMemo(
    () => parseFiltersFromURL(searchParams),
    [searchParams]
  );

  const handleFilterChange = (newFilters: ProjectFilters) => {
    const params = filtersToURLParams(newFilters);
    const queryString = params.toString();
    router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  // Infinite scroll
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProjects(
    { ...filters, published: true },
    { maxTotalItems: isAuthenticated ? undefined : MAX_FREE_PROJECTS }
  );

  // Merge all pages of projects
  const allProjects = data?.pages.flatMap((page) => page.data) || [];
  const reachedFreeCap =
    !isAuthenticated && allProjects.length >= MAX_FREE_PROJECTS;
  const projects = reachedFreeCap
    ? allProjects.slice(0, MAX_FREE_PROJECTS)
    : allProjects;

  // Load next page on scroll
  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      (isAuthenticated || !reachedFreeCap)
    ) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isAuthenticated,
    reachedFreeCap,
  ]);

  if (isLoading) {
    return (
      <HomepageLayout
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
        initialFilters={filters}
      >
        <SkeletonProjectGrid />
      </HomepageLayout>
    );
  }

  if (isError) {
    return (
      <HomepageLayout
        onFilterChange={handleFilterChange}
        isLoading={false}
        initialFilters={filters}
      >
        <ErrorState
          message="An error has occurred while loading the projects. Please try again later."
          queryKey={["projects-infinite", { ...filters, published: true }]}
        />
      </HomepageLayout>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <HomepageLayout
        onFilterChange={handleFilterChange}
        isLoading={false}
        initialFilters={filters}
      >
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
    <HomepageLayout
      onFilterChange={handleFilterChange}
      isLoading={isLoading}
      initialFilters={filters}
    >
      <ProjectGrid projects={projects} />
      {hasNextPage && (isAuthenticated || !reachedFreeCap) && (
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
      {!isAuthenticated && reachedFreeCap && (
        <BlurredSigninCtaGrid
          projects={projects}
          maxShown={MAX_FREE_PROJECTS}
          ctaHref="/auth/login"
        />
      )}
    </HomepageLayout>
  );
}

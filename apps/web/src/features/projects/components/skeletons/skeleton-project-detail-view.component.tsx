import { SkeletonBreadcrumb } from "@/shared/components/shared/Breadcrumb";
import { Skeleton } from "@/shared/components/ui/skeleton";

import { SkeletonProjectFilters } from "../project-filters.component";
import { SkeletonProjectHero } from "../project-hero.component";
import { SkeletonProjectSideBar } from "../project-side-bar.component";
import { SkeletonRoleCard } from "../role-card.component";

/**
 * Renders a skeleton loading UI for the project detail view.
 *
 * Displays placeholder components for the breadcrumb, project hero, sidebar, filters, and a list of role cards to indicate loading state while project details are being fetched.
 */
export default function SkeletonProjectDetailView() {
  return (
    <>
      <div className="mx-auto mt-1 max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40">
        <SkeletonBreadcrumb />
      </div>
      <div className="mx-auto mt-2 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-4 md:px-8 lg:px-24 xl:px-40">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
          <div className="w-full lg:max-w-[721.96px]">
            <SkeletonProjectHero />
          </div>
          <SkeletonProjectSideBar />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between lg:max-w-[721.96px]">
            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="mt-1 h-3.5 w-3.5" />
            </div>
            <SkeletonProjectFilters count={1} />
          </div>
          <div className="mt-6 mb-30 flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRoleCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

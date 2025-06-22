import { SkeletonProjectFilters } from "../project-filters.component";
import { SkeletonProjectHero } from "../project-hero.component";
import { SkeletonProjectSideBar } from "../project-side-bar.component";
import { SkeletonRoleCard } from "../role-card.component";

/**
 * Renders a skeleton placeholder for the project detail page layout.
 *
 * Displays placeholder components for the project hero, sidebar, filters, and a list of role cards to indicate loading state before actual content is available.
 */
export default function SkeletonProjectDetail() {
  return (
    <div className="mx-auto mt-4 flex max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
        <div className="w-full lg:max-w-[721.96px]">
          <SkeletonProjectHero />
        </div>
        <SkeletonProjectSideBar />
      </div>
      <div>
        <div className="mb-3 h-5 w-40 rounded bg-gray-200"></div>
        <SkeletonProjectFilters count={1} />
        <div className="mt-6 mb-30 flex flex-col gap-3">
          <SkeletonRoleCard />
          <SkeletonRoleCard />
          <SkeletonRoleCard />
        </div>
      </div>
    </div>
  );
}
